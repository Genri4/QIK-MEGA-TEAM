import { Body, Param, Query } from '@nestjs/common';

import { ApplyHttpControllerContract, ApplyHttpMethodContract } from '@shared';
import { AuthPayload, AuthTokenPayload } from '@systems';

import { UserService } from './user.service';
import {
  UsersContract,
  GetUsersListContract,
  FindUserContract,
  GetAuthorizedUserContract,
  UpdateUserContract,
  UpdateAuthorizeUserContract,
} from './contracts';

@ApplyHttpControllerContract(UsersContract)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApplyHttpMethodContract(GetUsersListContract)
  async getList(@Query() query: GetUsersListContract.RequestQuery): Promise<GetUsersListContract.ResponsePayload> {
    return this.userService.getList(query);
  }

  @ApplyHttpMethodContract(FindUserContract)
  async findById(@Param() params: FindUserContract.RequestParams): Promise<FindUserContract.ResponsePayload> {
    return this.userService.findById(params);
  }

  @ApplyHttpMethodContract(GetAuthorizedUserContract)
  async findAuthorized(@AuthTokenPayload() auth: AuthPayload): Promise<GetAuthorizedUserContract.ResponsePayload> {
    return this.userService.findAuthorized(auth);
  }

  @ApplyHttpMethodContract(UpdateUserContract)
  async updateById(
    @Param() params: UpdateUserContract.RequestParams,
    @Body() body: UpdateUserContract.RequestBody,
  ): Promise<UpdateUserContract.ResponsePayload> {
    return this.userService.updateById(params, body);
  }
  @ApplyHttpMethodContract(UpdateAuthorizeUserContract)
  async updateAuthorized(
    @Body() body: UpdateAuthorizeUserContract.RequestBody,
    @AuthTokenPayload() auth: AuthPayload,
  ): Promise<UpdateAuthorizeUserContract.ResponsePayload> {
    return this.userService.updateAuthorized(auth, body);
  }
}
