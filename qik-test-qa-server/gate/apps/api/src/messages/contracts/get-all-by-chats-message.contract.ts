import { ApiProperty } from '@nestjs/swagger';

import {
  ApiSchemaName,
  HttpContractData,
  HttpResponseBody,
  IdField,
  PaginationDTO,
} from '@shared';
import { MessagesContract } from './messages.contract';
import { MessagesDTO } from '@domains';

export namespace GetAllByChatMessageContract {
  export const method = HttpContractData.Method.Get;
  export const path = ':chatId/all';
  export const name = 'GetAllByChat';
  export const description = 'Get messages by chat';

  @ApiSchemaName(`${MessagesContract.name}${name}RequestQuery`)
  export class RequestQuery extends PaginationDTO.Request {}

  @ApiSchemaName(`${MessagesContract.name}${name}RequestParams`)
  export class RequestParams {
    @IdField()
    chatId: string;
  }

  @ApiSchemaName(`${MessagesContract.name}${name}ResponsePayload`)
  export class ResponsePayload {
    @ApiProperty({ type: MessagesDTO, isArray: true })
    messages: MessagesDTO[];
    @ApiProperty({ type: PaginationDTO.Response })
    pagination: PaginationDTO.Response;
  }

  export const ResponseBody = HttpResponseBody(ResponsePayload);
}
