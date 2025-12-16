import {
  ApiSchemaName,
  HttpContractData,
  HttpResponseBody,
  IdField,
} from '@shared';
import { MessagesContract } from './messages.contract';

export namespace DeleteMessageContract {
  export const method = HttpContractData.Method.Delete;
  export const path = ':id';
  export const name = 'Delete';
  export const description = 'Deleted message';

  @ApiSchemaName(`${MessagesContract.name}${name}RequestParams`)
  export class RequestParams {
    @IdField()
    id: string;
  }

  @ApiSchemaName(`${MessagesContract.name}${name}ResponsePayload`)
  export class ResponsePayload {
    deleted: boolean;
  }

  export const ResponseBody = HttpResponseBody(ResponsePayload);
}
