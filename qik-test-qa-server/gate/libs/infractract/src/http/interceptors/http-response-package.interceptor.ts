import { CallHandler, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

import { HttpResponse } from '../response';

@Injectable()
export class HttpResponsePackageInterceptor implements NestInterceptor {
  intercept(_, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((payload: unknown) => {
        return new HttpResponse({
          code: 'ok',
          payload: payload || null,
        });
      }),
    );
  }
}
