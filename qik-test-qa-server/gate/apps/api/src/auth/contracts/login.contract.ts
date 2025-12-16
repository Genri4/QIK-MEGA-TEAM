import { ApiProperty } from '@nestjs/swagger';

import { UserDTO } from '@domains';

import { AuthContract } from './auth.contract';
import { ApiSchemaName, HttpContractData, HttpResponseBody } from '@shared';

export namespace LoginContract {
  export const method = HttpContractData.Method.Post;
  export const path = 'login';
  export const name = 'Login';
  export const description = 'Logins user';

  @ApiSchemaName(`${AuthContract.name}${name}RequestBody`)
  export class RequestBody extends UserDTO.Login {}

  @ApiSchemaName(`${AuthContract.name}${name}ResponsePayload`)
  export class ResponsePayload {
    @ApiProperty({ type: UserDTO })
    user: UserDTO;
  }

  export const ResponseBody = HttpResponseBody(ResponsePayload);
}
