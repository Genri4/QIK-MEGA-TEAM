import { Request } from 'express';
import { Injectable } from '@nestjs/common';

import { Nullable } from '@shared';

import { TokenExtractor } from './token-extractor.interface';
import { REFRESH_TOKEN_COOKIE_NAME } from '../constants';

@Injectable()
export class RefreshTokenExtractor implements TokenExtractor {
  extract(request: Request): Nullable<string> {
    return request?.cookies?.[REFRESH_TOKEN_COOKIE_NAME] ?? null;
  }
}
