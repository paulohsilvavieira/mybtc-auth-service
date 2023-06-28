import {
  BadRequestException,
  Body,
  Controller,
  Logger,
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
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly singInUsecase: SignInProtocol,
    private readonly registerAuthUsecase: RegisterAuthProtocol,
  ) {}
  @Post('/login')
  async login(@Body() body: SignInUsecaseInput): Promise<any> {
    this.logger.log('Start Request');
    this.logger.log('Send Body to usecase!');

    const { token } = await this.singInUsecase.exec(body);
    if (!token) {
      this.logger.log('Finish Request!');
      throw new UnauthorizedException();
    }
    this.logger.log('Finish Request!');

    return token;
  }

  @Post('/register')
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
}
