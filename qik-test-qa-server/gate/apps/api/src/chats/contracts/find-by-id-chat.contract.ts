import { ApiProperty } from '@nestjs/swagger';

import { ApiSchemaName, HttpContractData, HttpResponseBody, IdField } from '@shared';
import { ChatsDTO } from '@domains';
import { ChatsContract } from './chats.contract';


export namespace FindByIdChatContract {
  export const method = HttpContractData.Method.Get;
  export const path = ':id';
  export const name = 'FindById';
  export const description = 'Find chat by id';

  @ApiSchemaName(`${ChatsContract.name}${name}RequestParams`)
  export class RequestParams {
    @IdField()
    id: string;
  }

  @ApiSchemaName(`${ChatsContract.name}${name}ResponsePayload`)
  export class ResponsePayload {
    @ApiProperty({ type: ChatsDTO })
    chat: ChatsDTO;
  }

  export const ResponseBody = HttpResponseBody(ResponsePayload);
}
