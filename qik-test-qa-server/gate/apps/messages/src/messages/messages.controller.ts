import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MessagesService } from './messages.service';
import { PaginationDTO } from '@shared';
import { MessagesDTO, SenderType } from '@domains';

@Controller()
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}
  @MessagePattern('messages.getAllByChats')
  async getAllByChats(
    @Payload()
    data: {
      query: PaginationDTO.Request;
      params: { chatId: string };
    },
  ) {
    return this.messagesService.getAllByChats(data.query, data.params);
  }

  @MessagePattern('messages.getAllByChatsAndSender')
  async getAllByChatsAndSender(
    @Payload()
    data: {
      query: PaginationDTO.Request & { sender: SenderType };
      params: { chatId: string };
    },
  ) {
    return this.messagesService.getAllByChatsAndSender(data.query, data.params);
  }

  @MessagePattern('messages.findById')
  async findById(@Payload() data: { params: { id: string } }) {
    return this.messagesService.findById(data.params);
  }

  @MessagePattern('messages.create')
  async create(
    @Payload()
    data: {
      params: { chatId: string };
      body: MessagesDTO.Create;
    },
  ) {
    return this.messagesService.create(data.params, data.body);
  }

  @MessagePattern('messages.update')
  async update(
    @Payload()
    data: {
      params: { id: string };
      body: MessagesDTO.Create;
    },
  ) {
    return this.messagesService.update(data.params, data.body);
  }

  @MessagePattern('messages.delete')
  async delete(@Payload() data: { params: { id: string } }) {
    return this.messagesService.delete(data.params);
  }
}
