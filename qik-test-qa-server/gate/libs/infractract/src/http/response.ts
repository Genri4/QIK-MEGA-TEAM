import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Http } from './types';

export class HttpResponse<Payload = unknown> {
  @ApiProperty({ enum: Http.Code.Enum, example: Http.Code.Enum.OK })
  code: Http.Code;
  @ApiPropertyOptional()
  message?: string;

  @ApiProperty()
  payload?: unknown;
  constructor(response: HttpResponse<Payload>) {
    this.code = response.code;
    this.message = response.message;
    this.payload = response.payload;
  }
}
