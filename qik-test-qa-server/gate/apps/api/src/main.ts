import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import fastifyCors from '@fastify/cors';
import fastifyHelmet from '@fastify/helmet';
import fastifyMultipart from '@fastify/multipart';
import fastifyCookie from '@fastify/cookie';

import { AppModule } from './app.module';
import { ConfigSchema } from '@infractract/config';
import { LoggerService } from '@infractract/logger';
import { ValidationPipeOptions } from '@infractract/validation';
import {
  HttpErrorFilter,
  HttpResponsePackageInterceptor,
  HttpUnhandledErrorFilter,
  HttpValidationErrorFilter,
} from '@infractract/http';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  const config =
    app.get<ConfigService<ConfigSchema.Service.Gate>>(ConfigService);

  await app.register(fastifyCors as any, {
    origin: (origin, cb) => {
      /*
      const allowedOrigins = config.get<string[]>('GATE_HTTP_ALLOWED_ORIGINS') ?? [];
    */

      // Разрешаем запросы без Origin (например, от Postman)
      if (!origin) {
        cb(null, true);
        return;
      }

      cb(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  await app.register(fastifyHelmet as any, {
    contentSecurityPolicy: false,
  });
  await app.register(fastifyCookie as any);
  await app.register(fastifyMultipart as any, {
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
  });
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: ['nats://nats:4222'],
    },
  });

  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'v',
  });

  const loggerService = app.get<LoggerService>(LoggerService);
  app.useLogger(loggerService);
  app.useGlobalPipes(new ValidationPipe(new ValidationPipeOptions()));
  app.useGlobalFilters(
    new HttpValidationErrorFilter(loggerService),
    new HttpErrorFilter(loggerService),
    new HttpUnhandledErrorFilter(loggerService),
  );
  app.useGlobalInterceptors(new HttpResponsePackageInterceptor());

  const swaggerDocument = SwaggerModule.createDocument(
    app,
    new DocumentBuilder().build(),
  );
  SwaggerModule.setup('api/v1/docs/swagger', app, swaggerDocument, {});
  app.getHttpAdapter().get('/api/v1/docs', (_, reply) => {
    reply.type('text/html').send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body style="margin:0">
          <redoc spec-url='/api/v1/docs/swagger-json' expand-responses="200,201"></redoc>
          <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script>
        </body>
      </html>
   `);
  });

  await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.NATS,
    options: {
      servers: ['nats://nats:4222'],
    },
  });
  await app.listen(config.get<number>('GATE_HTTP_PORT'), '0.0.0.0');
}

bootstrap().catch(console.error);
