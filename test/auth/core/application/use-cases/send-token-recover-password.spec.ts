import { mock, MockProxy } from 'jest-mock-extended';
import { AuthRepoProtocol } from '@/auth/core/domain/protocols/repository';
import { SendTokenRecoverPasswordUsecase } from '@/auth/core/application/usecases';
import { Bcrypt } from '@/auth/core/domain/protocols/cryptography';
import { Test, TestingModule } from '@nestjs/testing';
import { PublishMessage } from '@/auth/core/domain/protocols/message-broker/publish-message';
import { ConfigModule } from '@nestjs/config';

describe('SendTokenRecoverPasswordUsecase', () => {
  let authRepoMock: MockProxy<AuthRepoProtocol>;
  let bcryptMock: MockProxy<Bcrypt>;
  let messageBrokerMock: MockProxy<PublishMessage>;
  let sut: SendTokenRecoverPasswordUsecase;
  beforeAll(() => {
    authRepoMock = mock();
    bcryptMock = mock();
    messageBrokerMock = mock();
    messageBrokerMock.pub.mockResolvedValue();
    authRepoMock.saveTokenRecoverPassword.mockResolvedValue();
    authRepoMock.verifyExistsEmail.mockResolvedValue(true);
    bcryptMock.encrypt.mockResolvedValue({
      hashText: 'validToken',
    });
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forFeature(async () => ({
          EXCHANGE_NAME_MAILER_SERVICE: 'Any_Value',
          ROUTING_KEY_MAILER_SERVICE: 'Any_Value',
        })),
      ],
      providers: [
        SendTokenRecoverPasswordUsecase,

        {
          provide: AuthRepoProtocol,
          useValue: authRepoMock,
        },
        {
          provide: Bcrypt,
          useValue: bcryptMock,
        },
        {
          provide: PublishMessage,
          useValue: messageBrokerMock,
        },
      ],
    }).compile();
    sut = module.get(SendTokenRecoverPasswordUsecase);
  });

  test('should return true if email recover password sended sucessfull', async () => {
    const result = await sut.execute('any@email.com');
    expect(result.message).toEqual('Password recovery email has been sent!');
  });

  test('should return false if dont find auth info to save token recover by email', async () => {
    authRepoMock.verifyExistsEmail.mockResolvedValueOnce(false);
    try {
      await sut.execute('wrong@email.com');
    } catch (error) {
      expect(error).toEqual(new Error());
    }
  });
});
