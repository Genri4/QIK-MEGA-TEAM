import { CanActivate, ExecutionContext, HttpStatus, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { UseJWTGuard } from './decorators';
import { TokenType } from './types';
import { REQUEST_TOKEN_PAYLOAD_FIELD } from '@systems';
import { TokenResolverService } from './resolvers';
import { TokenExtractorService } from './extractors';
import { HttpError } from '@infractract/http';

export class JwtGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(TokenExtractorService)
    private readonly extractor: TokenExtractorService,
    @Inject(TokenResolverService)
    private readonly tokenConverterService: TokenResolverService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request;

    const options = this.reflector.get(UseJWTGuard, context.getHandler());

    if (!options) {
      return true;
    }

    Object.entries(options).forEach(([type, policy]) => {
      const isRequired = policy === 'required';
      const tokenType = type as TokenType;

      const token = this.extractor.extract(tokenType, request);
      if (!token) {
        if (isRequired) {
          throw new HttpError({
            status: HttpStatus.UNAUTHORIZED,
            code: 'token_not_provided',
            message: `Token [${tokenType}] was not provided for policy [${policy}]`,
          });
        } else {
          return true;
        }
      }

      try {
        const payload = this.tokenConverterService.verify(tokenType, token);
        this.enrichRequestByToken(request, tokenType, payload);
      } catch (e) {
        if (isRequired) {
          throw new HttpError({
            status: HttpStatus.UNAUTHORIZED,
            code: 'token_invalid',
            message: `Token [${tokenType}] signature is invalid`,
          });
        }
      }
    });

    return true;
  }

  private enrichRequestByToken(request: Request, tokenType: TokenType, payload: any): void {
    if (request[REQUEST_TOKEN_PAYLOAD_FIELD]) {
      request[REQUEST_TOKEN_PAYLOAD_FIELD][tokenType] = payload;
    } else {
      request[REQUEST_TOKEN_PAYLOAD_FIELD] = {
        [tokenType]: payload,
      };
    }
  }
}
