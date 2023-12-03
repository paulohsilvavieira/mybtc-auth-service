import {
  Body,
  Controller,
  HttpCode,
  Logger,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  SignInProtocol,
  RegisterAuthProtocol,
  SendTokenRecoverPasswordProtocol,
  UpdatePasswordProtocol,
  ResetPasswordProtocol,
} from '../../core/domain/protocols/usecases';

import { ApiTokenGuard } from '../guards/api-token.guard';
import { CustomValidationPipe } from '../pipes/custom-validation-pipe';
import {
  CreateUserDto,
  RecoverPasswordDto,
  ResetPasswordDto,
  SignInDto,
  UpdatePasswordDTO,
} from '../dtos';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly singInUsecase: SignInProtocol,
    private readonly registerAuthUsecase: RegisterAuthProtocol,
    private readonly updatePasswordUsecase: UpdatePasswordProtocol,
    private readonly recoverPasswordUsecase: SendTokenRecoverPasswordProtocol,
    private readonly resetPasswordUsecase: ResetPasswordProtocol,
  ) {}
  @Post('/login')
  @HttpCode(200)
  async login(@Body() body: SignInDto) {
    return this.singInUsecase.execute(body);
  }

  @Post('/register')
  @HttpCode(201)
  async register(@Body() body: CreateUserDto) {
    return await this.registerAuthUsecase.execute(body);
  }

  @Put('/update/password')
  @UseGuards(ApiTokenGuard)
  @HttpCode(200)
  async updatePassword(@Body() body: UpdatePasswordDTO) {
    return await this.updatePasswordUsecase.execute(body);
  }

  @Post('/recover/password')
  @HttpCode(200)
  async recoverPassword(@Body() body: RecoverPasswordDto) {
    return await this.recoverPasswordUsecase.execute(body.email);
  }

  @Post('/reset/password')
  @HttpCode(200)
  async resetPassword(@Body() body: ResetPasswordDto) {
    return await this.resetPasswordUsecase.execute(body);
  }
}
