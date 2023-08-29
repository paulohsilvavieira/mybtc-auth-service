import { mock, MockProxy } from 'jest-mock-extended';
import { BcryptProtocol } from '../protocols/cryptography';
import { AuthRepoProtocol } from '../protocols/repository/auth-repo';
import { UpdatePasswordUseCase } from './update-password-usecases';
describe('Update passsword', () => {
  let sut: UpdatePasswordUseCase;
  let authRepo: MockProxy<AuthRepoProtocol>;
  let bcryptMock: MockProxy<BcryptProtocol>;
  beforeAll(() => {
    authRepo = mock();
    bcryptMock = mock();
    authRepo.updatePassword.mockResolvedValue({ success: true });
    bcryptMock.encrypt.mockResolvedValue({
      hashText: 'digest_string',
    });
  });
  beforeEach(() => {
    sut = new UpdatePasswordUseCase(authRepo, bcryptMock);
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
    authRepo.updatePassword.mockResolvedValueOnce({
      success: false,
    });
    const result = await sut.exec({
      oldPassword: 'old_wrong_password',
      newPassword: 'new_password',
      authorizationId: 'authId',
    });
    expect(result.success).toEqual(false);
  });
});
