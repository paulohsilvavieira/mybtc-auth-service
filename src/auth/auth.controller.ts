import { Controller, Get } from '@nestjs/common';
import { SignIn } from '@auth/protocols/usecases';

@Controller('auth')
export class AuthController {
  constructor(private readonly singInUsecase: SignIn) {}
  @Get('/signin')
  async signIn(): Promise<any> {
    const result = await this.singInUsecase.exec({
      email: 'email@email.com',
      password: '123456',
    });
    return result;
  }
}
