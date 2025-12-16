import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,
      options: {
        servers: ['nats://nats:4222'],
        queue: 'messages_queue',
      },
    },
  );

  await app.listen();
  console.log('Messages Microservice Messages (NATS Listener) is running...');
}

bootstrap().catch((err) => console.error(err));
