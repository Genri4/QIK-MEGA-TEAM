import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { JwtPayload } from 'jsonwebtoken';

import { Nullable } from '@shared';

import { TokenType } from '../types';
import { TokenResolver } from './token-resolver.interface';
import { AccessTokenResolver } from './access-token.resolver';
import { RefreshTokenResolver } from './refresh-token.resolver';
import { ConfigSchema } from '@infractract/config';

@Injectable()
export class TokenResolverService {
  private readonly _jwtType2TokenConvertor: {
    [key in TokenType]: TokenResolver<any>;
  };

  constructor(
    private readonly configService: ConfigService<ConfigSchema.Scope.JWT>,
  ) {
    this._jwtType2TokenConvertor = {
      [TokenType.Access]: new AccessTokenResolver(this.configService),
      [TokenType.Refresh]: new RefreshTokenResolver(this.configService),
    };
  }

  getMaxAge(tokenType: TokenType): number {
    return this._jwtType2TokenConvertor[tokenType].maxAge;
  }

  sign<T>(tokenType: TokenType, payload: JwtPayload & T): Nullable<string> {
    return this._jwtType2TokenConvertor[tokenType].sign<T>(payload, tokenType);
  }

  verify<T>(tokenType: TokenType, token: string): Nullable<JwtPayload & T> {
    return this._jwtType2TokenConvertor[tokenType].verify(token, tokenType);
  }
}
