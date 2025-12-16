import { ApiProperty } from '@nestjs/swagger';

import {
  ApiSchemaName,
  HttpContractData,
  HttpResponseBody,
  IdField,
} from '@shared';
import { MessagesContract } from './messages.contract';
import { MessagesDTO } from '@domains';

export namespace CreateMessageContract {
  export const method = HttpContractData.Method.Post;
  export const path = ':chatId';
  export const name = 'Create';
  export const description = 'Creates message by chat';

  @ApiSchemaName(`${MessagesContract.name}${name}RequestParams`)
  export class RequestParams {
    @IdField()
    chatId: string;
  }

  @ApiSchemaName(`${MessagesContract.name}${name}RequestBody`)
  export class RequestBody extends MessagesDTO.Create {}

  @ApiSchemaName(`${MessagesContract.name}${name}ResponsePayload`)
  export class ResponsePayload {
    @ApiProperty({ type: MessagesDTO })
    message: MessagesDTO;
  }

  export const ResponseBody = HttpResponseBody(ResponsePayload);
}
