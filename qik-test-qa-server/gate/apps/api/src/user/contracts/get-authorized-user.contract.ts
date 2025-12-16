import { ApiProperty } from '@nestjs/swagger';

import { JWTGuardOptions, TokenType } from '@systems';
import { UserDTO } from '@domains';
import { ApiSchemaName, HttpContractData, HttpResponseBody } from '@shared';

import { UsersContract } from './users.contract';

export namespace GetAuthorizedUserContract {
  export const method = HttpContractData.Method.Get;
  export const path = 'authorized';
  export const name = 'GetAuthorized';
  export const description = 'Returns authorized user';

  export const jwt: JWTGuardOptions = { [TokenType.Access]: 'required' };

  @ApiSchemaName(`${UsersContract.name}${name}ResponsePayload`)
  export class ResponsePayload {
    @ApiProperty({ type: UserDTO })
    user: UserDTO;
  }

  export const ResponseBody = HttpResponseBody(ResponsePayload);
}
