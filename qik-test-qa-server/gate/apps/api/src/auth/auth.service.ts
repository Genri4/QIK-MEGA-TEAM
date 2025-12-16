import {
  ACCESS_TOKEN_COOKIE_NAME,
  AuthPayload,
  JwtService,
  REFRESH_TOKEN_COOKIE_NAME,
  TokenType,
} from '@systems';
import { FastifyReply } from 'fastify';
import { AuthRepository, UserDTO } from '@domains';

import { HttpError } from '@infractract/http';
import { PasswordService } from '@infractract';
import { Injectable } from '@nestjs/common';
import {
  LoginContract,
  LogoutContract,
  RefreshContract,
  RegisterContract,
} from './contracts';

@Injectable()
export class AuthService {
  constructor(
    private readonly password: PasswordService,
    private readonly jwt: JwtService,
    private readonly authRepository: AuthRepository,
  ) {}

  async register(
    res: FastifyReply,
    body: RegisterContract.RequestBody,
  ): Promise<RegisterContract.ResponsePayload> {
    const hashedPassword = await this.password.hashPassword(body.password);
    const user = await this.authRepository.register(body);
    console.log(user);

    if (!user) {
      throw new HttpError({ status: 404, code: 'user_not_found' });
    }

    await this.authRepository.createAuthMethod(user.id, hashedPassword);

    const tokens = this.jwt.signAuthTokens({ owner: { id: user.id } });
    this.enrichRequestWithTokenCookie(res, TokenType.Access, tokens.access);
    this.enrichRequestWithTokenCookie(res, TokenType.Refresh, tokens.refresh);

    return { user: UserDTO.fromModel(user) };
  }

  async login(
    res: FastifyReply,
    body: LoginContract.RequestBody,
  ): Promise<LoginContract.ResponsePayload> {
    const user = await this.authRepository.login(body.email);

    const hashedPassword = user?.authMethods?.find(
      (i) => i.type === 'password',
    )?.reference;
    if (!user && !hashedPassword) {
      throw new HttpError({ status: 404, code: 'user_not_found' });
    }

    const isValidPassword = await this.password.checkPassword(
      body.password,
      hashedPassword,
    );
    if (!isValidPassword) {
      throw new HttpError({
        status: 401,
        code: 'wrong_auth_data',
      });
    }

    const tokens = this.jwt.signAuthTokens({ owner: { id: user.id } });
    this.enrichRequestWithTokenCookie(res, TokenType.Access, tokens.access);
    this.enrichRequestWithTokenCookie(res, TokenType.Refresh, tokens.refresh);

    return { user: UserDTO.fromModel(user) };
  }

  async refresh(
    res: FastifyReply,
    authPayload: AuthPayload,
  ): Promise<RefreshContract.ResponsePayload> {
    const tokens = this.jwt.signAuthTokens({
      owner: { id: authPayload.owner.id },
    });
    this.enrichRequestWithTokenCookie(res, TokenType.Access, tokens.access);
    this.enrichRequestWithTokenCookie(res, TokenType.Refresh, tokens.refresh);

    return {};
  }

  async logout(res: FastifyReply): Promise<LogoutContract.ResponsePayload> {
    this.clearRequestTokenCookie(res, TokenType.Access);
    this.clearRequestTokenCookie(res, TokenType.Refresh);

    return {};
  }

  private enrichRequestWithTokenCookie(
    res: FastifyReply,
    tokenType: TokenType,
    tokenValue: string,
  ) {
    const cookieName =
      tokenType === TokenType.Refresh
        ? REFRESH_TOKEN_COOKIE_NAME
        : ACCESS_TOKEN_COOKIE_NAME;
    const maxAge = this.jwt.getMaxAge(tokenType);

    res.setCookie(cookieName, tokenValue, {
      httpOnly: true,
      secure: true,
      maxAge,
      path: '/',
    });
  }

  private clearRequestTokenCookie(res: FastifyReply, tokenType: TokenType) {
    const cookieName =
      tokenType === TokenType.Refresh
        ? REFRESH_TOKEN_COOKIE_NAME
        : ACCESS_TOKEN_COOKIE_NAME;

    res.clearCookie(cookieName);
  }
}
