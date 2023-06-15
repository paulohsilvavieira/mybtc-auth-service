import {
  VerifyAuthRepoProtocol,
  VerifyAuthRepoInput,
  VerifyAuthRepoOutput,
} from '@auth/protocols/repository';
import { AuthenticationEntity } from '@entities/AuthenticationEntity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthenticationRepository implements VerifyAuthRepoProtocol {
  constructor(
    @InjectRepository(AuthenticationEntity)
    private readonly authTypeOrmRepository: Repository<AuthenticationEntity>,
  ) {}

  async verifyAuthByEmail(
    params: VerifyAuthRepoInput,
  ): Promise<VerifyAuthRepoOutput> {
    const user = await this.authTypeOrmRepository.findOneBy({
      email: params.email,
    });
    return {
      isValidEmail: user !== null,
      password: user !== null ? user.password : undefined,
    };
  }
}
