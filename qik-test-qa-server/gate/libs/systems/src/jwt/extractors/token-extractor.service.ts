import { Request } from 'express';

import { Nullable } from '@shared';

import { TokenType } from '../types';
import { TokenExtractor } from './token-extractor.interface';
import { AccessTokenExtractor } from './access-token.extractor';
import { RefreshTokenExtractor } from './refresh-token.extractor';

export class TokenExtractorService {
  private readonly _jwtTypeToTokenExtractor: { [key in TokenType]: TokenExtractor };

  constructor() {
    this._jwtTypeToTokenExtractor = {
      [TokenType.Access]: new AccessTokenExtractor(),
      [TokenType.Refresh]: new RefreshTokenExtractor(),
    };
  }

  extract(type: TokenType, request: Request): Nullable<string> {
    return this._jwtTypeToTokenExtractor[type].extract(request);
  }
}
