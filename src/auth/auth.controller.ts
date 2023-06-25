import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import {
  RegisterAuthProtocol,
  RegisterAuthUsecaseInput,
  SignInProtocol,
  SignInUsecaseInput,
} from '@auth/protocols/usecases';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly singInUsecase: SignInProtocol,
    private readonly registerAuthUsecase: RegisterAuthProtocol,
  ) {}
  @Post('/login')
  async login(@Body() body: SignInUsecaseInput): Promise<any> {
    const { token } = await this.singInUsecase.exec(body);
    if (!token) {
      return new UnauthorizedException();
    }
    return token;
  }

  @Post('/register')
  async register(@Body() body: RegisterAuthUsecaseInput): Promise<any> {
    const { success } = await this.registerAuthUsecase.exec(body);
    if (!success) {
      return new BadRequestException();
    }
    return { msg: 'User Created!' };
  }
}
