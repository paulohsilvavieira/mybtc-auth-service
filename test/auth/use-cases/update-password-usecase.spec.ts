import { mock, MockProxy } from 'jest-mock-extended';
import { BcryptProtocol } from '../../../src/auth/protocols/cryptography';
import { AuthRepoProtocol } from '../../../src/auth/protocols/repository/auth-repo';
import { UpdatePasswordUseCase } from '../../../src/auth/usecases/update-password-usecase';
import { Test, TestingModule } from '@nestjs/testing';
describe('Update passsword', () => {
  let sut: UpdatePasswordUseCase;
  let authRepo: MockProxy<AuthRepoProtocol>;
  let bcryptMock: MockProxy<BcryptProtocol>;
  beforeAll(() => {
    authRepo = mock();
    bcryptMock = mock();
    authRepo.findById.mockResolvedValue({ password: 'digest' });

    authRepo.updatePassword.mockResolvedValue({ success: true });
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
          provide: BcryptProtocol,
          useValue: bcryptMock,
        },
      ],
    }).compile();
    // sut = new UpdatePasswordUseCase(authRepo, bcryptMock);
    sut = module.get(UpdatePasswordUseCase);
  });
  test('should return true if process update passsword works', async () => {
    const result = await sut.exec({
      oldPassword: 'old_password',
      newPassword: 'new_password',
      authorizationId: 'authId',
    });
    expect(result.success).toEqual(true);
  });
  test('should return false if old password is incorrect', async () => {
    bcryptMock.verifyHash.mockResolvedValueOnce({
      isValid: false,
    });
    const result = await sut.exec({
      oldPassword: 'old_wrong_password',
      newPassword: 'new_password',
      authorizationId: 'authId',
    });
    expect(result.success).toEqual(false);
  });
});
