import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { FastifyReply } from 'fastify';

import { HttpError } from '../error';
import { HttpResponse } from '../response';
import { LoggerService } from '@infractract/logger';

const LOG_TAG = 'HttpErrorFilter';
@Catch(HttpError)
export class HttpErrorFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(error: HttpError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<FastifyReply>();

    this.logger.error(LOG_TAG + `|catch Handled error [status=${error.status}] [code=${error.code}] ${error.message}`);
    // @todo add monitoring alert

    res.code(error.status).send(
      new HttpResponse({
        code: error.code,
        payload: null,
        message: error?.message,
      }),
    );
  }
}
