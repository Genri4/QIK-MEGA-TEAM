import { sign, verify } from 'jsonwebtoken';

import { AuthPayload } from '../types';
import { BaseTokenResolver } from './base-token.resolver';
import { TokenResolver } from './token-resolver.interface';

export class RefreshTokenResolver
  extends BaseTokenResolver
  implements TokenResolver<AuthPayload>
{
  get secret() {
    return this.config.get('JWT_REFRESH_TOKEN_SECRET');
  }

  get maxAge() {
    return 7 * 24 * 60 * 60 * 1000; // 7 days
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
