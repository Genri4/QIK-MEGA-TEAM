import { Module } from '@nestjs/common';
import { Messages, MessagesRepository } from '@domains';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Messages])],
  providers: [MessagesService, MessagesRepository],
  controllers: [MessagesController],
  exports: [MessagesRepository],
})
export class MessagesModule {}
