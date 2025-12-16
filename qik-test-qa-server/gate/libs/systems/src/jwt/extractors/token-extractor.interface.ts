import { Request } from 'express';
import { Nullable } from '@shared';

export interface TokenExtractor {
  extract(request: Request): Nullable<string>;
}
