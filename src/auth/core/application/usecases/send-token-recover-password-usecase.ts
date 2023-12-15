import { Inject, Injectable } from '@nestjs/common';
import { Bcrypt } from '@/auth/core/domain/protocols/cryptography';
import {
  AuthRepoProtocol,
  SaveTokenRecoverPasswordInput,
} from '@/auth/core/domain/protocols/repository';

import { PublishMessage } from '@/auth/core/domain/protocols/message-broker/publish-message';
import { ConfigService } from '@nestjs/config';
import { SendTokenRecoverPasswordProtocol } from '@/auth/core/domain/protocols/usecases';
@Injectable()
export class SendTokenRecoverPasswordUsecase
  implements SendTokenRecoverPasswordProtocol
{
  @Inject(ConfigService)
  private readonly configService: ConfigService;

  constructor(
    private readonly authRepo: AuthRepoProtocol,
    private readonly bcryptService: Bcrypt,
    private readonly messageBroker: PublishMessage,
  ) {}

  async execute(email: string): Promise<{ message: string }> {
    const expirationTimeToken = Date.now() + 300000;
    const { hashText: tokenRecoverPassword } = await this.bcryptService.encrypt(
      expirationTimeToken.toString(),
    );
    const recoveryInfo: SaveTokenRecoverPasswordInput = {
      tokenRecoverPassword,
      email,
      expirationTimeToken,
    };

    await this.authRepo.saveTokenRecoverPassword(recoveryInfo);

    const emailExists = await this.authRepo.verifyExistsEmail(
      recoveryInfo.email,
    );
    if (!emailExists) {
      throw new Error();
    }

    await this.messageBroker.pub(
      {
        typeEmailToSend: 'RECOVER_PASSWORD',
        infoToSendOnEmail: {
          tokenRecoverPassword,
          email,
        },
      },
      {
        exchangeName: this.configService.get('EXCHANGE_NAME_MAILER_SERVICE'),
        routingKey: this.configService.get('ROUTING_KEY_MAILER_SERVICE'),
      },
    );
    return {
      message: 'Password recovery email has been sent!',
    };
  }
}
