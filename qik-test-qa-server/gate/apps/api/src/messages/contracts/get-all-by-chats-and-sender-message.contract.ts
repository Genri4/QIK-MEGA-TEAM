import { ApiProperty } from '@nestjs/swagger';

import {
  ApiSchemaName,
  HttpContractData,
  HttpResponseBody,
  IdField,
  PaginationDTO,
} from '@shared';
import { MessagesContract } from './messages.contract';
import { MessagesDTO, SenderType } from '@domains';
import { IsEnum } from 'class-validator';

export namespace GetAllByChatAndSenderMessageContract {
  export const method = HttpContractData.Method.Get;
  export const path = 'sender/:chatId/all';
  export const name = 'GetAllByChatAndSender';
  export const description = 'Get messages by chat and sender';

  @ApiSchemaName(`${MessagesContract.name}${name}RequestQuery`)
  export class RequestQuery extends PaginationDTO.Request {
    @ApiProperty()
    @IsEnum(() => SenderType)
    sender: SenderType;
  }

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
