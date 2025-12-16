import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { REQUEST_TOKEN_PAYLOAD_FIELD } from '@systems';
import { TokenType } from '../types';

export const AuthTokenPayload = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return (
    request?.[REQUEST_TOKEN_PAYLOAD_FIELD]?.[TokenType.Access] ||
    request?.[REQUEST_TOKEN_PAYLOAD_FIELD]?.[TokenType.Refresh]
  );
});
