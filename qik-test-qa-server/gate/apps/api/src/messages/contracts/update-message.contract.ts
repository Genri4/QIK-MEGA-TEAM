import { ApiProperty } from '@nestjs/swagger';

import {
  ApiSchemaName,
  HttpContractData,
  HttpResponseBody,
  IdField,
} from '@shared';
import { MessagesContract } from './messages.contract';
import { MessagesDTO } from '@domains';

export namespace UpdateMessageContract {
  export const method = HttpContractData.Method.Put;
  export const path = ':id';
  export const name = 'Update';
  export const description = 'Creates message by chat';

  @ApiSchemaName(`${MessagesContract.name}${name}RequestParams`)
  export class RequestParams {
    @IdField()
    id: string;
  }

  @ApiSchemaName(`${MessagesContract.name}${name}RequestBody`)
  export class RequestBody extends MessagesDTO.Update {}

  @ApiSchemaName(`${MessagesContract.name}${name}ResponsePayload`)
  export class ResponsePayload {
    @ApiProperty({ type: MessagesDTO })
    message: MessagesDTO;
  }

  export const ResponseBody = HttpResponseBody(ResponsePayload);
}
