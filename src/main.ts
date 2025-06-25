/* Copyright 2024 - 2025 Prokhor Kalinin

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

import { join } from 'path';

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';
import { BenchmarkInterceptor } from './common/interceptors/benchmark.interceptor';
import { report } from './winston.config';
import { morse } from './common/utils/morse';


async function bootstrap(): Promise<void> {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    // Just Enable CORSm it's a public API.
    app.enableCors();

    app.useGlobalPipes(new ValidationPipe({
        whitelist: true
    }));

    app.useStaticAssets(join(__dirname, '..', 'public'), {
        prefix: '/public/'
    });

    app.useStaticAssets(join(__dirname, '..', 'public-static'), {
        prefix: '/public-static/'
    });
    if (process.env.EXPOSE_SWAGGER)
        try {
            const config = new DocumentBuilder()
                .setTitle('Avalanche API Engine')
                .setDescription('Avalanche Docs')
                .setVersion('0.1.3')
                .addBearerAuth()
                .build();

            report.warn(morse.yellow('Setting Up Swagger'));
            const document = SwaggerModule.createDocument(app, config);
            document.servers = [{ url: '/', description: 'test-stand' }, { url: '/', description: 'local' }];
            report.info(morse.green('Document Servers Configured'));
            SwaggerModule.setup('docs', app, document, {
                customCssUrl: '/public-static/swagger.css'
            });
            SwaggerModule.setup('docs', app, document);
            report.info(morse.green('Swagger Setup Complete'));
        } catch (error: Error | unknown) {
            report.error(error);
        }


    if (process.env.NODE_ENV !== 'production')
        app.useGlobalInterceptors(new BenchmarkInterceptor());

    await app.listen(3000);
}

bootstrap();