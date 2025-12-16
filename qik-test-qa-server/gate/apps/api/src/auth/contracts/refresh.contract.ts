import { ApiSchemaName, HttpContractData, HttpResponseBody } from '@shared';
import { JWTGuardOptions, TokenType } from '@systems';

import { AuthContract } from './auth.contract';

export namespace RefreshContract {
  export const method = HttpContractData.Method.Put;
  export const path = 'refresh';
  export const name = 'Refresh';
  export const description = 'Refreshes user';

  export const jwt: JWTGuardOptions = { [TokenType.Refresh]: 'required' };

  @ApiSchemaName(`${AuthContract.name}${name}RequestBody`)
  export class RequestBody {}

  @ApiSchemaName(`${AuthContract.name}${name}ResponsePayload`)
  export class ResponsePayload {}

  export const ResponseBody = HttpResponseBody(ResponsePayload);
}
