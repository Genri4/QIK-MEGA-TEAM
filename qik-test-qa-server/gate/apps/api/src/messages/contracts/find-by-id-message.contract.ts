import { ApiProperty } from '@nestjs/swagger';

import { ApiSchemaName, HttpContractData, HttpResponseBody, IdField } from '@shared';
import { MessagesContract } from './messages.contract';
import { MessagesDTO } from '@domains';


export namespace FindByIdMessageContract {
  export const method = HttpContractData.Method.Get;
  export const path = ':id';
  export const name = 'FindById';
  export const description = 'Find message by id';

  @ApiSchemaName(`${MessagesContract.name}${name}RequestParams`)
  export class RequestParams {
    @IdField()
    id: string;
  }

  @ApiSchemaName(`${MessagesContract.name}${name}ResponsePayload`)
  export class ResponsePayload {
    @ApiProperty({ type: MessagesDTO })
    message: MessagesDTO;
  }

  export const ResponseBody = HttpResponseBody(ResponsePayload);
}
