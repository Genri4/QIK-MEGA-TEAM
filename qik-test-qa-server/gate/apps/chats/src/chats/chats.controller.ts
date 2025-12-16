import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ChatsService } from './chats.service';
import { AuthPayload } from '@systems';
import { PaginationDTO } from '@shared';
import { ChatsDTO } from '@domains';

@Controller()
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}
  @MessagePattern('chats.getAllByUser')
  async getAllByUser(
    @Payload()
    data: {
      query: PaginationDTO.Request;
      authPayload: AuthPayload;
    },
  ) {
    return this.chatsService.getAllByUser(data.query, data.authPayload);
  }

  @MessagePattern('chats.findById')
  async findById(@Payload() data: { params: { id: string } }) {
    return this.chatsService.findById(data.params);
  }

  @MessagePattern('chats.create')
  async create(
    @Payload()
    data: {
      body: ChatsDTO.Create;
      authPayload: AuthPayload;
    },
  ) {
    return this.chatsService.create(data.body, data.authPayload);
  }

  @MessagePattern('chats.update')
  async update(
    @Payload()
    data: {
      params: { id: string };
      body: ChatsDTO.Update;
    },
  ) {
    return this.chatsService.update(data.params, data.body);
  }

  @MessagePattern('chats.delete')
  async delete(@Payload() data: { params: { id: string } }) {
    return this.chatsService.delete(data.params);
  }
}
