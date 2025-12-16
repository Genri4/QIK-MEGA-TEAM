import { sign, verify } from 'jsonwebtoken';

import { BaseTokenResolver } from './base-token.resolver';
import { TokenResolver } from './token-resolver.interface';
import { AuthPayload } from '../types';

export class AccessTokenResolver
  extends BaseTokenResolver
  implements TokenResolver<AuthPayload>
{
  get secret() {
    return this.config.get('JWT_ACCESS_TOKEN_SECRET');
  }

  get maxAge() {
    return 5 * 60 * 1000; // 5 minutes
  }

  sign(payload: AuthPayload): string {
    return sign(payload, this.secret, {
      expiresIn: this.maxAge,
    });
  }

  verify(token: string): AuthPayload {
    return verify(token, this.secret) as AuthPayload;
  }
}
