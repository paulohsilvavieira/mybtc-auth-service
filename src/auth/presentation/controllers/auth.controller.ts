import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Logger,
  Post,
  Put,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  SignInProtocol,
  RegisterAuthProtocol,
  SendTokenRecoverPasswordProtocol,
  UpdatePasswordProtocol,
  UpdatePasswordInput,
} from '../../core/domain/protocols/usecases';

import { ApiTokenGuard } from '../guards/api-token.guard';
import { AuthenticationParams } from '@/auth/core/domain/entities/auth-info';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly singInUsecase: SignInProtocol,
    private readonly registerAuthUsecase: RegisterAuthProtocol,
    private readonly updatePasswordUsecase: UpdatePasswordProtocol,
    private readonly recoverPasswordUsecase: SendTokenRecoverPasswordProtocol,
  ) {}
  @Post('/login')
  @HttpCode(200)
  async login(@Body() body: AuthenticationParams) {
    return await this.singInUsecase.execute(body);
  }

  @Post('/register')
  @HttpCode(201)
  async register(@Body() body: AuthenticationParams) {
    return await this.registerAuthUsecase.execute(body);
  }
  @Put('/update/password')
  @UseGuards(ApiTokenGuard)
  @HttpCode(200)
  async updatePassword(@Body() body: UpdatePasswordInput) {
    return await this.updatePasswordUsecase.execute(body);
  }
  @Post('/recover/password')
  @HttpCode(200)
  async recoverPassword(@Body() body: { email: string }) {
    return await this.recoverPasswordUsecase.execute(body.email);
  }
}
