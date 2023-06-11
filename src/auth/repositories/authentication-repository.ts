import { IVerifyAuthRepo } from '@auth/protocols/repository';
import { SignInParams } from '@auth/protocols/usecases';
import { AuthenticationEntity } from '@entities/AuthenticationEntity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthenticationRepository implements IVerifyAuthRepo {
  constructor(
    @InjectRepository(AuthenticationEntity)
    private readonly authTypeOrmRepository: Repository<AuthenticationEntity>,
  ) {}

  async verifyAuth(params: SignInParams): Promise<{ isValid: boolean }> {
    const existsUser = await this.authTypeOrmRepository.findOneBy({
      email: params.email,
      password: params.password,
    });
    return {
      isValid: existsUser !== null,
    };
  }
}
