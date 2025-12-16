import { ApiProperty } from '@nestjs/swagger';

import { ApiSchemaName, HttpContractData, HttpResponseBody, PaginationDTO } from '@shared';
import { UserDTO } from '@domains';

import { UsersContract } from './users.contract';

export namespace GetUsersListContract {
  export const method = HttpContractData.Method.Get;
  export const path = '/all';
  export const name = 'GetList';
  export const description = 'Returns list of users';

  @ApiSchemaName(`${UsersContract.name}${name}RequestQuery`)
  export class RequestQuery extends PaginationDTO.Request {}

  @ApiSchemaName(`${UsersContract.name}${name}ResponsePayload`)
  export class ResponsePayload {
    @ApiProperty({ type: UserDTO, isArray: true })
    users: UserDTO[];
    @ApiProperty({ type: PaginationDTO.Response })
    pagination: PaginationDTO.Response;
  }
  export const ResponseBody = HttpResponseBody(ResponsePayload);
}
