import {
  ApiSchemaName,
  HttpContractData,
  HttpResponseBody,
  IdField,
} from '@shared';
import { ChatsContract } from './chats.contract';

export namespace DeleteChatContract {
  export const method = HttpContractData.Method.Delete;
  export const path = ':id';
  export const name = 'Delete';
  export const description = 'Deleted chat';

  @ApiSchemaName(`${ChatsContract.name}${name}RequestParams`)
  export class RequestParams {
    @IdField()
    id: string;
  }

  @ApiSchemaName(`${ChatsContract.name}${name}ResponsePayload`)
  export class ResponsePayload {
    deleted: boolean;
  }

  export const ResponseBody = HttpResponseBody(ResponsePayload);
}
