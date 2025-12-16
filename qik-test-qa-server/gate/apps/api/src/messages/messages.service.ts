import {
  CreateMessageContract,
  DeleteMessageContract,
  FindByIdMessageContract,
  GetAllByChatAndSenderMessageContract,
  GetAllByChatMessageContract,
  UpdateMessageContract,
} from './contracts';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class MessagesService {
  constructor(
    @Inject('MESSAGES_SERVICE') private readonly messagesClient: ClientProxy,
  ) {}

  async getAllByChats(
    query: GetAllByChatMessageContract.RequestQuery,
    params: GetAllByChatMessageContract.RequestParams,
  ): Promise<GetAllByChatMessageContract.ResponsePayload> {
    return this.messagesClient
      .send('messages.getAllByChats', { query, params })
      .toPromise();
  }

  async getAllByChatsAndSender(
    query: GetAllByChatAndSenderMessageContract.RequestQuery,
    params: GetAllByChatAndSenderMessageContract.RequestParams,
  ): Promise<GetAllByChatAndSenderMessageContract.ResponsePayload> {
    return this.messagesClient
      .send('messages.getAllByChatsAndSender', { query, params })
      .toPromise();
  }

  async findById(
    params: FindByIdMessageContract.RequestParams,
  ): Promise<FindByIdMessageContract.ResponsePayload | null> {
    return this.messagesClient
      .send('messages.findById', { params })
      .toPromise();
  }

  async create(
    params: CreateMessageContract.RequestParams,
    body: CreateMessageContract.RequestBody,
  ): Promise<CreateMessageContract.ResponsePayload> {
    return this.messagesClient
      .send('messages.create', { params, body })
      .toPromise();
  }

  async update(
    params: UpdateMessageContract.RequestParams,
    body: UpdateMessageContract.RequestBody,
  ): Promise<UpdateMessageContract.ResponsePayload> {
    return this.messagesClient
      .send('messages.update', { params, body })
      .toPromise();
  }

  async delete(
    params: DeleteMessageContract.RequestParams,
  ): Promise<DeleteMessageContract.ResponsePayload> {
    return this.messagesClient.send('messages.delete', { params }).toPromise();
  }
}
