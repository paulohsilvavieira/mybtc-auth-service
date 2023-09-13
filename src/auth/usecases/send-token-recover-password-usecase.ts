import { MailerServiceProtocol } from 'src/services/protocols/mail-services';
import { AuthRepoProtocol } from '../protocols/repository';
import {
  SendTokenRecoverPasswordInput,
  SendTokenRecoverPasswordOutput,
  SendTokenRecoverPasswordProtocol,
} from '../protocols/usecases/send-token-recover-password';

export class SendTokenRecoverPasswordUsecase
  implements SendTokenRecoverPasswordProtocol
{
  constructor(
    private readonly mailerService: MailerServiceProtocol,
    private readonly authRepo: AuthRepoProtocol,
  ) {}
  async exec(
    params: SendTokenRecoverPasswordInput,
  ): Promise<SendTokenRecoverPasswordOutput> {
    const { email } = params;
    const tokenRecoverPassword = 'token';
    const saveTokenRecoverPassword =
      await this.authRepo.saveTokenRecoverPassword({
        token: tokenRecoverPassword,
        email,
      });
    if (!saveTokenRecoverPassword.success) {
      return {
        success: false,
      };
    }
    const mailSended = await this.mailerService.sendEmail(params);
    return {
      success: mailSended.success,
    };
  }
}
