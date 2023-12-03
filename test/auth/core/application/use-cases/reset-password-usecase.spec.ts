/* eslint-disable prefer-const */
import { mock, MockProxy } from 'jest-mock-extended';
import { Bcrypt } from '@/auth/core/domain/protocols/cryptography';
import { AuthRepoProtocol } from '@/auth/core/domain/protocols/repository';
import { ResetPasswordUseCase } from '@/auth/core/application/usecases';
import { Test, TestingModule } from '@nestjs/testing';

describe('Reset Password Usecase', () => {
  let authRepositoryMock: MockProxy<AuthRepoProtocol>;
  let bcryptMock: MockProxy<Bcrypt>;
  let sut: ResetPasswordUseCase;

  beforeAll(() => {
    authRepositoryMock = mock();
    bcryptMock = mock();

    authRepositoryMock.getExpirationTimeTokenResetPassword.mockResolvedValue({
      expirationTimeToken: Date.now(),
    });
    authRepositoryMock.updatePasswordAuth.mockResolvedValue();

    authRepositoryMock.invalidTokenExpiration.mockResolvedValue();

    bcryptMock.verifyHash.mockResolvedValue({
      isValid: true,
    });
    bcryptMock.encrypt.mockResolvedValue({ hashText: 'digest' });
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResetPasswordUseCase,
        {
          provide: AuthRepoProtocol,
          useValue: authRepositoryMock,
        },
        {
          provide: Bcrypt,
          useValue: bcryptMock,
        },
      ],
    }).compile();

    sut = module.get(ResetPasswordUseCase);
  });

  test('should be defined', () => {
    expect(sut).toBeDefined();
  });

  test('Should return "message: Password reset successfully"', async () => {
    const result = await sut.execute({
      email: 'valid@email.com',
      newPassword: 'new_password',
      tokenRecoverPassword: 'token',
    });

    expect(result).toEqual({
      message: 'Password reset successfully',
    });
  });
});
