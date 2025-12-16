import { ApiProperty } from '@nestjs/swagger';

import { UserDTO } from '@domains';

import { AuthContract } from './auth.contract';
import { ApiSchemaName, HttpContractData, HttpResponseBody } from '@shared';

export namespace RegisterContract {
  export const method = HttpContractData.Method.Post;
  export const path = 'register';
  export const name = 'Register';
  export const description = 'Registers user';

  @ApiSchemaName(`${AuthContract.name}${name}RequestBody`)
  export class RequestBody extends UserDTO.Register {}

  @ApiSchemaName(`${AuthContract.name}${name}ResponsePayload`)
  export class ResponsePayload {
    @ApiProperty({ type: UserDTO })
    user: UserDTO;
  }

  export const ResponseBody = HttpResponseBody(ResponsePayload);
}
