import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatsService } from './chats.service';
import { Chats, ChatsRepository } from '@domains';
import { ChatsController } from './chats.controller';

console.log(ChatsRepository);

@Module({
  imports: [TypeOrmModule.forFeature([Chats])],
  providers: [ChatsService, ChatsRepository],
  controllers: [ChatsController],
  exports: [ChatsRepository],
})
export class ChatsModule {}
