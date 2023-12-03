import { mock, MockProxy } from 'jest-mock-extended';
import { Bcrypt } from '@/auth/core/domain/protocols/cryptography';
import { AuthRepoProtocol } from '@/auth/core/domain/protocols/repository/auth-repo';
import { UpdatePasswordUseCase } from '@/auth/core/application/usecases/update-password-usecase';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationOldPasswordException } from '@/auth/core/domain/exceptions';
describe('Update passsword', () => {
  let sut: UpdatePasswordUseCase;
  let authRepo: MockProxy<AuthRepoProtocol>;
  let bcryptMock: MockProxy<Bcrypt>;
  beforeAll(() => {
    authRepo = mock();
    bcryptMock = mock();
    authRepo.getPasswordToCompre.mockResolvedValue({ password: 'digest' });

    authRepo.updatePasswordAuth.mockResolvedValue();
    bcryptMock.encrypt.mockResolvedValue({
      hashText: 'digest_string',
    });
    bcryptMock.verifyHash.mockResolvedValue({
      isValid: true,
    });
  });
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdatePasswordUseCase,
        {
          provide: AuthRepoProtocol,
          useValue: authRepo,
        },
        {
          provide: Bcrypt,
          useValue: bcryptMock,
        },
      ],
    }).compile();
    // sut = new UpdatePasswordUseCase(authRepo, bcryptMock);
    sut = module.get(UpdatePasswordUseCase);
  });
  test('should return true if process update passsword works', async () => {
    const result = await sut.execute({
      oldPassword: 'old_password',
      newPassword: 'new_password',
      email: 'email@email.com',
    });
    expect(result).toEqual({
      message: 'Password Updated',
    });
  });
  test('should return false if old password is incorrect', async () => {
    bcryptMock.verifyHash.mockResolvedValueOnce({
      isValid: false,
    });
    try {
      await sut.execute({
        oldPassword: 'old_wrong_password',
        newPassword: 'new_password',
        email: 'email@email.com',
      });
    } catch (error) {
      expect(error).toEqual(new AuthenticationOldPasswordException());
    }
  });
});
