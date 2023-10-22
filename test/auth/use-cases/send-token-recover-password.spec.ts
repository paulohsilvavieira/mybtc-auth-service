import { mock, MockProxy } from 'jest-mock-extended';
import { AuthRepoProtocol } from '../../../src/auth/protocols/repository';
import { SendTokenRecoverPasswordUsecase } from '../../../src/auth/usecases/send-token-recover-password-usecase';
import { JwtProtocol } from '../../../src/auth/protocols/cryptography';
import { Test, TestingModule } from '@nestjs/testing';

describe('SendTokenRecoverPasswordUsecase', () => {
  let authRepoMock: MockProxy<AuthRepoProtocol>;
  let jwtMock: MockProxy<JwtProtocol>;
  let sut: SendTokenRecoverPasswordUsecase;
  beforeAll(() => {
    authRepoMock = mock();
    jwtMock = mock();
    authRepoMock.saveTokenRecoverPassword.mockResolvedValue({
      success: true,
    });
    jwtMock.createToken.mockResolvedValue({
      token: 'validToken',
    });
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SendTokenRecoverPasswordUsecase,
        {
          provide: AuthRepoProtocol,
          useValue: authRepoMock,
        },
        {
          provide: JwtProtocol,
          useValue: jwtMock,
        },
      ],
    }).compile();
    sut = module.get(SendTokenRecoverPasswordUsecase);
  });

  test('should return true if email recover password sended sucessfull', async () => {
    const result = await sut.exec({ email: 'any@email.com' });
    expect(result.success).toEqual(true);
  });

  test('should return false if dont find auth info to save token recover by email', async () => {
    authRepoMock.saveTokenRecoverPassword.mockResolvedValueOnce({
      success: false,
    });
    const result = await sut.exec({ email: 'wrong@email.com' });
    expect(result.success).toEqual(false);
  });
});
