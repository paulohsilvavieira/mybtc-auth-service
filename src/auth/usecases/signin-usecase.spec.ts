/* eslint-disable prefer-const */
import { mock, MockProxy } from 'jest-mock-extended';
import { SignInUsecase } from './signin-usecase';
import { VerifyAuthRepoProtocol } from '@auth/protocols/repository';
import { VerifyHashProtocol } from '@auth/protocols/cryptography';

describe('SignIn Usecase', () => {
  let authRepositoryMock: MockProxy<VerifyAuthRepoProtocol>;
  let bcryptMock: MockProxy<VerifyHashProtocol>;

  let sut: SignInUsecase;
  beforeAll(() => {
    authRepositoryMock = mock();
    bcryptMock = mock();
    authRepositoryMock.verifyAuthByEmail.mockResolvedValue({
      isValidEmail: true,
      password: 'any_password',
    });
    bcryptMock.verifyHash.mockResolvedValue({
      isValid: true,
    });
  });

  beforeEach(() => {
    sut = new SignInUsecase(authRepositoryMock, bcryptMock);
  });

  test('should return jwt valid when send email and password valid', async () => {
    const { token } = await sut.exec({
      email: 'valid@email.com',
      password: '12345678',
    });
    expect(token).toEqual('validToken');
  });
  test('should return undefined token when send invalid credentials', async () => {
    authRepositoryMock.verifyAuthByEmail.mockResolvedValueOnce({
      isValidEmail: false,
      password: undefined,
    });
    const { token } = await sut.exec({
      email: 'wrongemail@email.com',
      password: 'wrongpassword',
    });
    expect(token).toBeUndefined();
  });
});
