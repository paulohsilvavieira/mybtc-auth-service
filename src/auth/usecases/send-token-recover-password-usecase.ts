import { Inject, Injectable } from '@nestjs/common';
import { JwtProtocol } from '../protocols/cryptography';
import { AuthRepoProtocol } from '../protocols/repository';
import {
  SendTokenRecoverPasswordInput,
  SendTokenRecoverPasswordOutput,
  SendTokenRecoverPasswordProtocol,
} from '../protocols/usecases/send-token-recover-password';
import { PublisherMessage } from '../protocols/message-broker/publish-message';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class SendTokenRecoverPasswordUsecase
  implements SendTokenRecoverPasswordProtocol
{
  constructor(
    private readonly authRepo: AuthRepoProtocol,
    private readonly generateToken: JwtProtocol,
    private readonly messageBroker: PublisherMessage,
    @Inject(ConfigService)
    private readonly configService: ConfigService,
  ) {}
  async exec(
    params: SendTokenRecoverPasswordInput,
  ): Promise<SendTokenRecoverPasswordOutput> {
    const { email } = params;

    const tokenRecoverPassword = await this.generateToken.createToken({
      email,
    });

    const recoveryInfo = {
      token: tokenRecoverPassword.token,
      email,
      expiration_time_token: Date.now() + 300000,
    };
    const saveTokenRecoverPassword =
      await this.authRepo.saveTokenRecoverPassword(recoveryInfo);
    if (!saveTokenRecoverPassword.success) {
      return {
        success: false,
      };
    }
    console.log;
    await this.messageBroker.pub(
      {
        typeEmail: 'RECOVER_PASSWORD',
        ...recoveryInfo,
      },
      {
        exchangeName: this.configService.get('EXCHANGE_NAME_MAILER_SERVICE'),
        routingKey: this.configService.get('ROUTING_KEY_MAILER_SERVICE'),
      },
    );
    return {
      success: true,
    };
  }
}
