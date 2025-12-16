import { ApiProperty } from '@nestjs/swagger';

import {
  ApiSchemaName,
  HttpContractData,
  HttpResponseBody,
} from '@shared';
import { ChatsContract } from './chats.contract';
import { ChatsDTO } from '@domains';
import { JWTGuardOptions, TokenType } from '@systems';

export namespace CreateChatContract {
  export const method = HttpContractData.Method.Post;
  export const path = '';
  export const name = 'Create';
  export const description = 'Creates chat by chat';

  export const jwt: JWTGuardOptions = { [TokenType.Access]: 'required' };

  @ApiSchemaName(`${ChatsContract.name}${name}RequestBody`)
  export class RequestBody extends ChatsDTO.Create {}

  @ApiSchemaName(`${ChatsContract.name}${name}ResponsePayload`)
  export class ResponsePayload {
    @ApiProperty({ type: ChatsDTO })
    chat: ChatsDTO;
  }

  export const ResponseBody = HttpResponseBody(ResponsePayload);
}
