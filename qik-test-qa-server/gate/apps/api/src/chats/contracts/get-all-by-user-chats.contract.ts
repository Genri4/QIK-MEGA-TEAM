import { ApiProperty } from '@nestjs/swagger';

import {
  ApiSchemaName,
  HttpContractData,
  HttpResponseBody,
  PaginationDTO,
} from '@shared';
import { JWTGuardOptions, TokenType } from '@systems';
import { ChatsContract } from './chats.contract';
import { ChatsDTO } from '@domains';

export namespace GetAllByUserChatsContract {
  export const method = HttpContractData.Method.Get;
  export const path = '/all';
  export const name = 'GetAllByChat';
  export const description = 'Get messages by chat';

  export const jwt: JWTGuardOptions = { [TokenType.Access]: 'required' };

  @ApiSchemaName(`${ChatsContract.name}${name}RequestQuery`)
  export class RequestQuery extends PaginationDTO.Request {}

  @ApiSchemaName(`${ChatsContract.name}${name}ResponsePayload`)
  export class ResponsePayload {
    @ApiProperty({ type: ChatsDTO, isArray: true })
    chats: ChatsDTO[];
    @ApiProperty({ type: PaginationDTO.Response })
    pagination: PaginationDTO.Response;
  }

  export const ResponseBody = HttpResponseBody(ResponsePayload);
}
