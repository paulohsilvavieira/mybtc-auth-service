import { IVerifyAuthRepo } from '@auth/protocols/repository';
import { SignInParams } from '@auth/protocols/usecases';
import { AuthenticationEntity } from '@entities/AuthenticationEntity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class AuthenticationRepository implements IVerifyAuthRepo {
  constructor(
    @InjectRepository(Repository<AuthenticationEntity>)
    private readonly authTypeOrmRepository: Repository<AuthenticationEntity>,
  ) {}

  async verifyAuth(params: SignInParams): Promise<{ isValid: boolean }> {
    return {
      isValid: true,
    };
  }
}
