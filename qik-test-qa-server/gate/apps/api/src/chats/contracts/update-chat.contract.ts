import { ApiProperty } from '@nestjs/swagger';

import {
  ApiSchemaName,
  HttpContractData,
  HttpResponseBody,
  IdField,
} from '@shared';
import { ChatsDTO } from '@domains';
import { ChatsContract } from './chats.contract';

export namespace UpdateChatContract {
  export const method = HttpContractData.Method.Put;
  export const path = ':id';
  export const name = 'Update';
  export const description = 'Creates chat by chat';

  @ApiSchemaName(`${ChatsContract.name}${name}RequestParams`)
  export class RequestParams {
    @IdField()
    id: string;
  }

  @ApiSchemaName(`${ChatsContract.name}${name}RequestBody`)
  export class RequestBody extends ChatsDTO.Update {}

  @ApiSchemaName(`${ChatsContract.name}${name}ResponsePayload`)
  export class ResponsePayload {
    @ApiProperty({ type: ChatsDTO })
    chat: ChatsDTO;
  }

  export const ResponseBody = HttpResponseBody(ResponsePayload);
}
