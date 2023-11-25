import { Inject, Injectable } from '@nestjs/common';
import { JwtProtocol } from '../../domain/protocols/cryptography';
import {
  AuthRepoProtocol,
  SaveTokenRecoverPasswordInput,
} from '../../domain/protocols/repository';

import { PublishMessage } from '../../domain/protocols/message-broker/publish-message';
import { ConfigService } from '@nestjs/config';
import { SendTokenRecoverPasswordProtocol } from '../../domain/protocols/usecases';
@Injectable()
export class SendTokenRecoverPasswordUsecase
  implements SendTokenRecoverPasswordProtocol
{
  @Inject(ConfigService)
  private readonly configService: ConfigService;

  constructor(
    private readonly authRepo: AuthRepoProtocol,
    private readonly generateToken: JwtProtocol,
    private readonly messageBroker: PublishMessage,
  ) {}

  async execute(email: string): Promise<{ message: string }> {
    const { token: tokenRecoverPassword } =
      await this.generateToken.createToken({
        email,
      });
    const recoveryInfo: SaveTokenRecoverPasswordInput = {
      tokenRecoverPassword,
      email,
      expirationTimeToken: Date.now() + 300000,
    };

    await this.authRepo.saveTokenRecoverPassword(recoveryInfo);

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
