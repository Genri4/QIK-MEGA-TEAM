import { Body, Res } from '@nestjs/common';
import { FastifyReply } from 'fastify';

import { AuthPayload, AuthTokenPayload } from '@systems';

import { AuthService } from './auth.service';
import {
  AuthContract,
  LoginContract,
  LogoutContract,
  RefreshContract,
  RegisterContract,
} from './contracts';
import { ApplyHttpControllerContract, ApplyHttpMethodContract } from '@shared';

@ApplyHttpControllerContract(AuthContract)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApplyHttpMethodContract(RegisterContract)
  async register(
    @Res({ passthrough: true }) res: FastifyReply,
    @Body() body: RegisterContract.RequestBody,
  ): Promise<RegisterContract.ResponsePayload> {
    return this.authService.register(res, body);
  }

  @ApplyHttpMethodContract(LoginContract)
  async login(
    @Res({ passthrough: true }) res: FastifyReply,
    @Body() body: LoginContract.RequestBody,
  ): Promise<LoginContract.ResponsePayload> {
    return this.authService.login(res, body);
  }

  @ApplyHttpMethodContract(RefreshContract)
  async refresh(
    @Res({ passthrough: true }) res: FastifyReply,
    @AuthTokenPayload() authPayload: AuthPayload,
  ): Promise<LogoutContract.ResponsePayload> {
    return this.authService.refresh(res, authPayload);
  }

  @ApplyHttpMethodContract(LogoutContract)
  async logout(@Res({ passthrough: true }) res: FastifyReply): Promise<LogoutContract.ResponsePayload> {
    return this.authService.logout(res);
  }
}
