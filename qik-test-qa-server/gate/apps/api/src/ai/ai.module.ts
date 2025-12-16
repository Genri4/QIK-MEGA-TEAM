import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AI_API_NATS_SERVERS',
        transport: Transport.NATS,
        options: { servers: ['nats://nats:4222'] },
      },
    ]),
  ],
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
