import { Body, Param, Query } from '@nestjs/common';

import { ApplyHttpControllerContract, ApplyHttpMethodContract } from '@shared';
import { ChatsService } from './chats.service';
import { AuthPayload, AuthTokenPayload } from '@systems';
import {
  ChatsContract,
  FindByIdChatContract,
  GetAllByUserChatsContract,
  CreateChatContract,
  UpdateChatContract,
  DeleteChatContract,
} from './contracts';

@ApplyHttpControllerContract(ChatsContract)
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @ApplyHttpMethodContract(GetAllByUserChatsContract)
  async getAllByUser(
    @Query() query: GetAllByUserChatsContract.RequestQuery,
    @AuthTokenPayload() authPayload: AuthPayload,
  ): Promise<GetAllByUserChatsContract.ResponsePayload> {
    return this.chatsService.getAllByUser(query, authPayload);
  }

  @ApplyHttpMethodContract(FindByIdChatContract)
  async findById(
    @Param() params: FindByIdChatContract.RequestParams,
  ): Promise<FindByIdChatContract.ResponsePayload> {
    return this.chatsService.findById(params);
  }

  @ApplyHttpMethodContract(CreateChatContract)
  async create(
    @Body() body: CreateChatContract.RequestBody,
    @AuthTokenPayload() authPayload: AuthPayload,
  ): Promise<CreateChatContract.ResponsePayload> {
    return this.chatsService.create(body, authPayload);
  }

  @ApplyHttpMethodContract(UpdateChatContract)
  async update(
    @Param() params: UpdateChatContract.RequestParams,
    @Body() body: UpdateChatContract.RequestBody,
  ): Promise<UpdateChatContract.ResponsePayload> {
    return this.chatsService.update(params, body);
  }

  @ApplyHttpMethodContract(DeleteChatContract)
  async delete(
    @Param() params: DeleteChatContract.RequestParams,
  ): Promise<DeleteChatContract.ResponsePayload> {
    return this.chatsService.delete(params);
  }
}
