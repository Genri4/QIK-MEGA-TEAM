import { TokenType } from '../types';

export interface TokenResolver<T> {
  maxAge: number;

  verify(token: string, type: TokenType): T;
  sign<P = Record<string, unknown>>(payload: T & P, type: TokenType): string;
}
