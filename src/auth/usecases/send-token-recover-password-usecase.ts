import { Injectable } from '@nestjs/common';
import { JwtProtocol } from '../protocols/cryptography';
import { AuthRepoProtocol } from '../protocols/repository';
import {
  SendTokenRecoverPasswordInput,
  SendTokenRecoverPasswordOutput,
  SendTokenRecoverPasswordProtocol,
} from '../protocols/usecases/send-token-recover-password';
@Injectable()
export class SendTokenRecoverPasswordUsecase
  implements SendTokenRecoverPasswordProtocol
{
  constructor(
    private readonly authRepo: AuthRepoProtocol,
    private readonly generateToken: JwtProtocol,
  ) {}
  async exec(
    params: SendTokenRecoverPasswordInput,
  ): Promise<SendTokenRecoverPasswordOutput> {
    const { email } = params;

    const tokenRecoverPassword = await this.generateToken.createToken({
      email,
    });
    const saveTokenRecoverPassword =
      await this.authRepo.saveTokenRecoverPassword({
        token: tokenRecoverPassword.token,
        email,
        expirationTokenTime: Date.now() + 300000,
      });
    if (!saveTokenRecoverPassword.success) {
      return {
        success: false,
      };
    }
    // TODO: "PUT HERE RABBITMQ SEND INFO TO MAILER SERVICE"
    return {
      success: true,
    };
  }
}
