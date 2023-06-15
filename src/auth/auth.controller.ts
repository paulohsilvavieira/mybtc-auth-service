import {
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInProtocol, SignInUsecaseInput } from '@auth/protocols/usecases';

@Controller('auth')
export class AuthController {
  constructor(private readonly singInUsecase: SignInProtocol) {}
  @Post('/login')
  async login(@Body() body: SignInUsecaseInput): Promise<any> {
    const { token } = await this.singInUsecase.exec(body);
    if (!token) {
      return new UnauthorizedException();
    }
    return token;
  }
}
