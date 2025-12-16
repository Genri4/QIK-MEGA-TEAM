import { Body, Param, Query } from '@nestjs/common';

import { ApplyHttpControllerContract, ApplyHttpMethodContract } from '@shared';

import { MessagesService } from './messages.service';
import {
  CreateMessageContract,
  DeleteMessageContract,
  FindByIdMessageContract,
  GetAllByChatMessageContract,
  GetAllByChatAndSenderMessageContract,
  MessagesContract,
  UpdateMessageContract,
} from './contracts';

@ApplyHttpControllerContract(MessagesContract)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @ApplyHttpMethodContract(GetAllByChatMessageContract)
  async getAllByChats(
    @Query() query: GetAllByChatMessageContract.RequestQuery,
    @Param() params: GetAllByChatMessageContract.RequestParams,
  ): Promise<GetAllByChatMessageContract.ResponsePayload> {
    return this.messagesService.getAllByChats(query, params);
  }

  @ApplyHttpMethodContract(GetAllByChatAndSenderMessageContract)
  async getAllByChatsAndSender(
    @Query() query: GetAllByChatAndSenderMessageContract.RequestQuery,
    @Param() params: GetAllByChatAndSenderMessageContract.RequestParams,
  ): Promise<GetAllByChatAndSenderMessageContract.ResponsePayload> {
    return this.messagesService.getAllByChatsAndSender(query, params);
  }

  @ApplyHttpMethodContract(FindByIdMessageContract)
  async findById(
    @Param() params: FindByIdMessageContract.RequestParams,
  ): Promise<FindByIdMessageContract.ResponsePayload> {
    return this.messagesService.findById(params);
  }

  @ApplyHttpMethodContract(CreateMessageContract)
  async create(
    @Param() params: CreateMessageContract.RequestParams,
    @Body() body: CreateMessageContract.RequestBody,
  ): Promise<CreateMessageContract.ResponsePayload> {
    return this.messagesService.create(params, body);
  }

  @ApplyHttpMethodContract(UpdateMessageContract)
  async update(
    @Param() params: UpdateMessageContract.RequestParams,
    @Body() body: UpdateMessageContract.RequestBody,
  ): Promise<UpdateMessageContract.ResponsePayload> {
    return this.messagesService.update(params, body);
  }

  @ApplyHttpMethodContract(DeleteMessageContract)
  async delete(
    @Param() params: DeleteMessageContract.RequestParams,
  ): Promise<DeleteMessageContract.ResponsePayload> {
    return this.messagesService.delete(params);
  }
}
