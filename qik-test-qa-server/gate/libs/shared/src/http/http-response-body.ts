import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { HttpResponse } from '@infractract/http';

export const HttpResponseBody = <T extends object>(responsePayload: Type<T>): Type<HttpResponse<T>> => {
  const payloadName = responsePayload.name;

  const responseName = payloadName.replace(/ResponsePayload$/, 'ResponseBody') || `${payloadName}ResponseBody`;

  class HttpResponseBody extends HttpResponse<T> {
    @ApiProperty({ type: responsePayload })
    payload: T;

    constructor(response: HttpResponse) {
      super({ code: response.code, message: response.message });
      this.payload = responsePayload as T;
    }
  }

  Object.defineProperty(HttpResponseBody, 'name', {
    value: responseName,
  });

  return HttpResponseBody;
};
