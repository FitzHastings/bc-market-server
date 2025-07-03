
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { WebSocket } from 'ws';

import { report } from '../winston.config';

import { parseBconomyMessage } from './utll/parse-bconomy-message';
import { DataFetchCounter } from './utll/data-fetch-counter';
import { BconomyMessage } from './dtos/bconomy-message';
import { PendingRequest } from './interfaces/pending-request.interface';
import { RichGameLogDto } from './dtos/rich-game-log.dto';
import { trimGameLog } from './interfaces/trim-game-log';


@Injectable()
export class BconomyService implements OnApplicationBootstrap {
    private ws: WebSocket;
    private cookie: string;
    private fetchCounter = new DataFetchCounter();
    private dataFetchMap = new Map<number, PendingRequest<unknown>>();


    public async onApplicationBootstrap(): Promise<void> {
        await this.connect();
        await this.migrateLogs();
    }

    public async migrateLogs(): Promise<void> {
        for (let i = 0; i < 164; i++) {
            report.info(`migrating item with id: ${i}`);
            try {
                let page = 1;
                while (true) {
                    // supressed for decreasing load on bconomy server
                    // eslint-disable-next-line no-await-in-loop
                    const response = await this.fetchItemLogsPage(page, i);
                    const logs = response[0]; // Le Terrible!
                    for (const log of logs) {
                        const trimmedLog = trimGameLog(log);
                        console.log(trimmedLog);
                    }
                    page++;
                }
            } catch (e) {
                report.error(e);
            }
        }
    }

    public async fetchItemLogsPage(page: number, itemId: number): Promise<RichGameLogDto[][]> {
        const messageId = this.fetchCounter.next();

        const message = [
            'dataFetch',
            {
                type: 'richLogsByIdType',
                idType: 'itemId',
                id: itemId,
                page
            }
        ];

        return this.performDataFetch<RichGameLogDto[][]>({ pingId: messageId, json: JSON.stringify(message) });
    }

    private async performDataFetch<T>(message: BconomyMessage): Promise<T> {
        return new Promise((resolve, reject) => {
            this.dataFetchMap.set(message.pingId, { resolve, reject });

            if (this.ws.readyState === WebSocket.OPEN) {
                this.ws.send(`42${message.pingId}${message.json}`);
                console.log(message.pingId, message.json);
            } else {
                reject(new Error('WebSocket is not connected'));
                this.dataFetchMap.delete(message.pingId);
            }
        });
    }


    private async prefetchCookie(): Promise<string> {
        const res = await fetch('https://bconomy.net/play/', {
            headers: {
                'Cookie': 'connect.sid=s%3AEe-jwMs7lfC--YxDwbmoO2nSwdB1Ytdg.ZcDioEx8eLPJCjvm8cZ4Uxbkp1%2FpZlf5RBMauu9MoMw'
            }
        });
        return res.headers.get('set-cookie');
    }

    private async connect(): Promise<void> {
        console.log( await this.prefetchCookie());
        this.ws = new WebSocket('wss://bconomy.net/socket.io/?EIO=4&transport=websocket', {
            'Cookie': 'connect.sid=s%3AEe-jwMs7lfC--YxDwbmoO2nSwdB1Ytdg.ZcDioEx8eLPJCjvm8cZ4Uxbkp1%2FpZlf5RBMauu9MoMw; discordCsrfState=632375jeff'
        });
        return new Promise<void>((resolve, reject) => {
            this.ws.on('open', () => {
                report.info('Connected to WebSocket server');
                // Send token immediately after connection
                if (this.ws.readyState === WebSocket.OPEN)
                    this.ws.send('40{"token":"Bconomy Public Web Client"}');
                else
                    reject(new Error('WebSocket is not connected'));
            });

            this.ws.on('message', (data: WebSocket.RawData) => {
                try {
                    const messageString = data.toString();
                    const message = parseBconomyMessage(messageString);
                    report.info(`Received message: ${JSON.stringify(message, null, 2)}`);

                    if (message.pingId === 2) {
                        report.info('Received Ping from Bconomy, ponging');
                        this.ws.send(3);
                        return;
                    }

                    if (message.pingId.toString().startsWith('43')) {
                        const requestId = parseInt(message.pingId.toString().substring(2));
                        const pendingRequest = this.dataFetchMap.get(requestId);
                        if (pendingRequest) {
                            report.info(`Received data fetch response for ${requestId}`);
                            pendingRequest.resolve(JSON.parse(message.json));
                            this.dataFetchMap.delete(message.pingId);
                            return;
                        }
                    }

                    const response = JSON.parse(message.json);
                    if (response.sid && this.ws.readyState === WebSocket.OPEN) {
                        report.info(`Received session ID: ${response.sid}`);
                        resolve();
                    }
                } catch (error) {
                    reject();
                    report.error('Error parsing message:', error);
                }
            });

            this.ws.on('error', (error) => {
                report.error('WebSocket error:', error);
            });

            this.ws.on('close', () => {
                report.warn('WebSocket connection closed');
            });
        });
    }
}
