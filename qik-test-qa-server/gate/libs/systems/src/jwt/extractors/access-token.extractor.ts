import { Request } from 'express';
import { Injectable } from '@nestjs/common';

import { Nullable } from '@shared';

import { TokenExtractor } from './token-extractor.interface';
import { ACCESS_TOKEN_COOKIE_NAME } from '../constants';

@Injectable()
export class AccessTokenExtractor implements TokenExtractor {
  extract(request: Request): Nullable<string> {
    return request?.cookies?.[ACCESS_TOKEN_COOKIE_NAME] ?? null;
  }
}
