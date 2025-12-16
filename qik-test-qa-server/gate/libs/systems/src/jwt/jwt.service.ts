import { JwtPayload } from 'jsonwebtoken';
import { HttpStatus, Injectable } from '@nestjs/common';

import { Nullable } from '@shared';

import { AuthPayload, TokenType } from './types';
import { TokenResolverService } from './resolvers';
import { HttpError } from '@infractract/http';

@Injectable()
export class JwtService {
  constructor(private readonly resolver: TokenResolverService) {}

  getMaxAge(tokenType: TokenType): number {
    return this.resolver.getMaxAge(tokenType);
  }

  signToken<T>(payload: JwtPayload & T, type: TokenType) {
    try {
      return this.resolver.sign<T>(type, payload);
    } catch (error) {
      console.error(error);
      throw new HttpError({
        code: 'unhandled_error',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Can't sign Token(type=${type})`,
      });
    }
  }

  verifyToken<T>(token: string, type: TokenType): Nullable<T> {
    try {
      return this.resolver.verify<T>(type, token);
    } catch (error) {
      throw new HttpError({
        code: 'token_invalid',
        status: HttpStatus.UNAUTHORIZED,
        message: `Token(type=${type}) invalid`,
      });
    }
  }

  signAuthTokens(payload: JwtPayload & AuthPayload) {
    return {
      access: this.signToken(payload, TokenType.Access),
      refresh: this.signToken(payload, TokenType.Refresh),
    };
  }
}
