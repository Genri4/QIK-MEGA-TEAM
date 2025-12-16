import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CHATS_SERVICE',
        transport: Transport.NATS,
        options: { servers: ['nats://nats:4222'] },
      },
    ]),
  ],
  providers: [ChatsService],
  controllers: [ChatsController],
})
export class ChatsModule {}
