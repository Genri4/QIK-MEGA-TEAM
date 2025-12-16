import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { FastifyReply } from 'fastify';

import { HttpResponse } from '../response';
import { LoggerService } from '@infractract/logger';

const LOG_TAG = 'HttpUnhandledErrorFilter';
@Catch(Error)
export class HttpUnhandledErrorFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  public catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<FastifyReply>();

    this.logger.error(LOG_TAG + `|catch Unhandled error: ` + exception.stack);
    // @todo add monitoring alert

    res.code(500).send(
      new HttpResponse({
        code: 'unhandled_error',
        payload: null,
      }),
    );
  }
}
