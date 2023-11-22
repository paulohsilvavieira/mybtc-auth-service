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
  SignInUsecaseInput,
  RegisterAuthUsecaseInput,
  SendTokenRecoverPasswordInput,
  SendTokenRecoverPasswordProtocol,
} from './protocols/usecases';
import {
  UpdatePasswordUseCaseInput,
  UpdatePasswordUseCaseProtocol,
} from './protocols/usecases/update-password';
import { ApiTokenGuard } from './guards/api-token.guard';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly singInUsecase: SignInProtocol,
    private readonly registerAuthUsecase: RegisterAuthProtocol,
    private readonly updatePasswordUsecase: UpdatePasswordUseCaseProtocol,
    private readonly recoverPasswordUsecase: SendTokenRecoverPasswordProtocol,
  ) {}
  @Post('/login')
  @HttpCode(200)
  async login(@Body() body: SignInUsecaseInput): Promise<any> {
    this.logger.log('Start Request');
    this.logger.log('Send Body to usecase!');

    const { token } = await this.singInUsecase.exec(body);
    if (!token) {
      this.logger.log('Finish Request!');
      throw new UnauthorizedException();
    }
    this.logger.log('Finish Request!');

    return { token };
  }

  @Post('/register')
  @HttpCode(201)
  async register(@Body() body: RegisterAuthUsecaseInput): Promise<any> {
    this.logger.log('Request Received');
    this.logger.log('Send body to usecase!');
    const { success } = await this.registerAuthUsecase.exec(body);
    if (!success) {
      this.logger.log('Finish Request!');
      throw new BadRequestException('Error on Create Authentication Info');
    }
    this.logger.log('Finish Request!');

    return { msg: 'User Created!' };
  }
  @Put('/update/password')
  @UseGuards(ApiTokenGuard)
  @HttpCode(200)
  async updatePassword(@Body() body: UpdatePasswordUseCaseInput) {
    const result = await this.updatePasswordUsecase.exec(body);
    if (!result.success) {
      throw new BadRequestException('Error on Update password');
    }

    return {
      msg: 'Password updated!',
    };
  }
  @Post('/recover/password')
  @HttpCode(200)
  async recoverPassword(@Body() body: SendTokenRecoverPasswordInput) {
    const result = await this.recoverPasswordUsecase.exec(body);
    if (!result.success) {
      throw new BadRequestException('Error on Update password');
    }

    return {
      msg: 'Email Password Sended!',
    };
  }
}
