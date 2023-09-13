import { mock, MockProxy } from 'jest-mock-extended';
import { MailerServiceProtocol } from 'src/services/protocols/mail-services';
import { AuthRepoProtocol } from '../protocols/repository';
import { SendTokenRecoverPasswordUsecase } from './send-token-recover-password-usecase';

describe('SendTokenRecoverPasswordUsecase', () => {
  let mailerServiceMock: MockProxy<MailerServiceProtocol>;
  let authRepoMock: MockProxy<AuthRepoProtocol>;

  let sut: SendTokenRecoverPasswordUsecase;
  beforeAll(() => {
    mailerServiceMock = mock();
    authRepoMock = mock();
    authRepoMock.saveTokenRecoverPassword.mockResolvedValue({
      success: true,
    });
    mailerServiceMock.sendEmail.mockResolvedValue({
      success: true,
      messageId: 'any_id',
    });
  });

  beforeEach(() => {
    sut = new SendTokenRecoverPasswordUsecase(mailerServiceMock, authRepoMock);
  });

  beforeAll(() => {});

  test('should return true if email recover password sended sucessfull', async () => {
    const result = await sut.exec({ email: 'any@email.com' });
    expect(result.success).toEqual(true);
  });

  test('should return false if email recover password  dont sended sucessfull', async () => {
    mailerServiceMock.sendEmail.mockResolvedValueOnce({
      success: false,
      messageId: undefined,
    });
    const result = await sut.exec({ email: 'any@email.com' });
    expect(result.success).toEqual(false);
  });

  test('should return false if dont find auth info to save token recover by email', async () => {
    authRepoMock.saveTokenRecoverPassword.mockResolvedValueOnce({
      success: false,
    });
    const result = await sut.exec({ email: 'wrong@email.com' });
    expect(result.success).toEqual(false);
  });
});
