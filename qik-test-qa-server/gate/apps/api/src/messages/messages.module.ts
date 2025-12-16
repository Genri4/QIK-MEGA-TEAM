import { Module } from '@nestjs/common';
import { MessagesRepository } from '@domains';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MESSAGES_SERVICE',
        transport: Transport.NATS,
        options: { servers: ['nats://nats:4222'] },
      },
    ]),
  ],
  providers: [MessagesService],
  controllers: [MessagesController],
})
export class MessagesModule {}
