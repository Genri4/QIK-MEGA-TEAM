import { ApiProperty } from '@nestjs/swagger';

import { ApiSchemaName, HttpContractData, HttpResponseBody, IdField } from '@shared';
import { UserDTO } from '@domains';

import { UsersContract } from './users.contract';
import { JWTGuardOptions, TokenType } from '@systems';

export namespace UpdateUserContract {
  export const method = HttpContractData.Method.Patch;
  export const path = ':userId';
  export const name = 'Update';
  export const description = 'Updates authorized user';

  export const jwt: JWTGuardOptions = { [TokenType.Access]: 'required' };

  @ApiSchemaName(`${UsersContract.name}${name}RequestParams`)
  export class RequestParams {
    @IdField()
    userId: string;
  }

  @ApiSchemaName(`${UsersContract.name}${name}RequestBody`)
  export class RequestBody extends UserDTO.Update {}

  @ApiSchemaName(`${UsersContract.name}${name}ResponsePayload`)
  export class ResponsePayload {
    @ApiProperty({ type: UserDTO })
    user: UserDTO;
  }

  export const ResponseBody = HttpResponseBody(ResponsePayload);
}
