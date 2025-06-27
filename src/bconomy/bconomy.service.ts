
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { WebSocket } from 'ws';

import { report } from '../winston.config';

import { SessionResponseDto } from './dtos/session-response.dto';
import { parseBconomyMessage } from './utll/parse-bconomy-message';

@Injectable()
export class BconomyService implements OnApplicationBootstrap {
    private ws: WebSocket;
    private isConnected: boolean = false;

    public onApplicationBootstrap(): void {
        this.connect();
    }

    private connect(): void {
        const headers = {
            'Cookie': 'connect.sid=s(token); discordCsrState=(some weird thing)'
        };

        this.ws = new WebSocket('wss://bconomy.net/socket.io/?EIO=4&transport=websocket', {
            headers
        });

        this.ws.on('open', () => {
            this.isConnected = true;
            report.info('Connected to WebSocket server');
            // Send token immediately after connection
            if (this.ws.readyState === WebSocket.OPEN) 
                this.ws.send(`40${JSON.stringify({ token: 'Bconomy Public Web Client' })}`);
        });

        this.ws.on('message', (data: WebSocket.RawData) => {
            try {
                const messageString = data.toString();
                const message = parseBconomyMessage(messageString);
                if (message.pingId === 0)
                    setTimeout(() => this.ws.send(`422${JSON.stringify(['dataFetch', { type: 'marketPreview' }])}`), 1000);

                if (message.pingId === 2) {
                    report.info('Received Ping from Bconomy, ponging');
                    this.ws.send(3);
                }

                const response = JSON.parse(message.json);
                if (response.sid && this.ws.readyState === WebSocket.OPEN)
                    report.info(`Received session ID: ${response.sid}`);
            } catch (error) {
                report.error('Error parsing message:', error);
            }
        });

        this.ws.on('error', (error) => {
            this.isConnected = false;
            report.error('WebSocket error:', error);
        });

        this.ws.on('close', () => {
            this.isConnected = false;
            report.warn('WebSocket connection closed');
        });
    }
}
