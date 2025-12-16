import { HttpStatus } from '@nestjs/common';

import { Http } from './types';

export class HttpError {
  status: HttpStatus;
  code: Http.Code;
  message?: string;

  constructor(response: HttpError) {
    this.status = response.status;
    this.code = response.code;
    this.message = response.message;
  }
}
