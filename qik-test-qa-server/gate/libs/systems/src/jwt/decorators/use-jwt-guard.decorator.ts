import { Reflector } from '@nestjs/core';

import { TokenType } from '../types';

export type JWTGuardOptions = Partial<{
  [key in TokenType]: 'required' | 'optional';
}>;
export const UseJWTGuard = Reflector.createDecorator<JWTGuardOptions>();
