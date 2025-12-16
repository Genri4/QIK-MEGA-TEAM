import { AuthPayload } from '@systems';
import {
  CreateChatContract,
  DeleteChatContract,
  FindByIdChatContract,
  GetAllByUserChatsContract,
  UpdateChatContract,
} from './contracts';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ChatsService {
  constructor(
    @Inject('CHATS_SERVICE') private readonly chatsClient: ClientProxy,
  ) {}

  async getAllByUser(
    query: GetAllByUserChatsContract.RequestQuery,
    authPayload: AuthPayload,
  ): Promise<GetAllByUserChatsContract.ResponsePayload> {
    return this.chatsClient
      .send('chats.getAllByUser', { query, authPayload })
      .toPromise();
  }

  async findById(
    params: FindByIdChatContract.RequestParams,
  ): Promise<FindByIdChatContract.ResponsePayload | null> {
    return this.chatsClient.send('chats.findById', { params }).toPromise();
  }

  async create(
    body: CreateChatContract.RequestBody,
    authPayload: AuthPayload,
  ): Promise<CreateChatContract.ResponsePayload> {
    return this.chatsClient
      .send('chats.create', { body, authPayload })
      .toPromise();
  }

  async update(
    params: UpdateChatContract.RequestParams,
    body: UpdateChatContract.RequestBody,
  ): Promise<UpdateChatContract.ResponsePayload> {
    return this.chatsClient.send('chats.update', { params, body }).toPromise();
  }

  async delete(
    params: DeleteChatContract.RequestParams,
  ): Promise<DeleteChatContract.ResponsePayload> {
    return this.chatsClient.send('chats.delete', { params }).toPromise();
  }
}
