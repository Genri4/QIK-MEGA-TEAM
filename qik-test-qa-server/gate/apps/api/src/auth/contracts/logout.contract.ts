import { ApiSchemaName, HttpContractData, HttpResponseBody } from '@shared';
import { JWTGuardOptions, TokenType } from '@systems';

import { AuthContract } from './auth.contract';

export namespace LogoutContract {
  export const method = HttpContractData.Method.Delete;
  export const path = 'logout';
  export const name = 'Logout';
  export const description = 'Logouts user';

  export const jwt: JWTGuardOptions = { [TokenType.Access]: 'required' };

  @ApiSchemaName(`${AuthContract.name}${name}RequestBody`)
  export class RequestBody {}

  @ApiSchemaName(`${AuthContract.name}${name}ResponsePayload`)
  export class ResponsePayload {}

  export const ResponseBody = HttpResponseBody(ResponsePayload);
}
