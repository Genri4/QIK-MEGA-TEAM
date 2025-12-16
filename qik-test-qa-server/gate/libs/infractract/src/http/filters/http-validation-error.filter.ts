import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { FastifyReply } from 'fastify';

import { HttpResponse } from '../response';
import { CustomValidationError } from '../../validation';
import { LoggerService } from '@infractract/logger';

const LOG_TAG = 'HttpValidationErrorFilter';
@Catch(CustomValidationError)
export class HttpValidationErrorFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: CustomValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<FastifyReply>();

    this.logger.error(LOG_TAG + `|catch Wrong request: ${exception.message}`);
    // @todo add monitoring alert

    res.code(400).send(
      new HttpResponse({
        code: 'bad_request',
        payload: null,
        message: exception.message,
      }),
    );
  }
}
