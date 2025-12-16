import { Inject, Injectable } from '@nestjs/common';

import { AuthPayload } from '@systems';
import {
  GetUsersListContract,
  FindUserContract,
  GetAuthorizedUserContract,
  UpdateUserContract,
  UpdateAuthorizeUserContract,
} from './contracts';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  async getList(
    query: GetUsersListContract.RequestQuery,
  ): Promise<GetUsersListContract.ResponsePayload> {
    return this.userClient.send('users.getAll', { query }).toPromise();
  }

  async findById(
    params: FindUserContract.RequestParams,
  ): Promise<FindUserContract.ResponsePayload> {
    return this.userClient.send('users.findById', { params }).toPromise();
  }

  async findAuthorized(
    auth: AuthPayload,
  ): Promise<GetAuthorizedUserContract.ResponsePayload> {
    return this.userClient.send('users.findAuthorize', { auth }).toPromise();
  }

  async updateById(
    params: UpdateUserContract.RequestParams,
    body: UpdateUserContract.RequestBody,
  ): Promise<UpdateUserContract.ResponsePayload> {
    return this.userClient
      .send('users.updateById', { params, body })
      .toPromise();
  }

  async updateAuthorized(
    auth: AuthPayload,
    body: UpdateAuthorizeUserContract.RequestBody,
  ): Promise<UpdateAuthorizeUserContract.ResponsePayload> {
    return this.userClient
      .send('users.updateAuthorized', { auth, body })
      .toPromise();
  }
}
