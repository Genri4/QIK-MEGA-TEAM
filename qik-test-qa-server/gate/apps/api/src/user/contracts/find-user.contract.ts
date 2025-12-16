import { ApiProperty } from '@nestjs/swagger';

import { ApiSchemaName, HttpContractData, HttpResponseBody, IdField } from '@shared';
import { UserDTO } from '@domains';

import { UsersContract } from './users.contract';

export namespace FindUserContract {
  export const method = HttpContractData.Method.Get;
  export const path = ':userId';
  export const name = 'FindOne';
  export const description = 'Finds user by id';

  @ApiSchemaName(`${UsersContract.name}${name}RequestParams`)
  export class RequestParams {
    @IdField()
    userId: string;
  }

  @ApiSchemaName(`${UsersContract.name}${name}ResponsePayload`)
  export class ResponsePayload {
    @ApiProperty({ type: UserDTO })
    user: UserDTO;
  }

  export const ResponseBody = HttpResponseBody(ResponsePayload);
}
