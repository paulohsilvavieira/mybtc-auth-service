/* eslint-disable prefer-const */
import { mock, MockProxy } from 'jest-mock-extended';
import { AuthRepoProtocol } from '@auth/protocols/repository';
import { BcryptProtocol } from '@auth/protocols/cryptography';
import { RegisterAuthUsecase } from './register-auth-usecase';
import { mockRegisterAuthInput, throwError } from '@tests/utils/mocks';
describe('Register Auth Usecase', () => {
  let authRepositoryMock: MockProxy<AuthRepoProtocol>;
  let bcryptMock: MockProxy<BcryptProtocol>;

  let sut: RegisterAuthUsecase;
  beforeAll(() => {
    authRepositoryMock = mock();
    bcryptMock = mock();
    authRepositoryMock.createAuth.mockResolvedValue({
      success: true,
    });
    bcryptMock.encrypt.mockResolvedValue({
      hashText: 'digest',
    });
  });

  beforeEach(() => {
    sut = new RegisterAuthUsecase(authRepositoryMock, bcryptMock);
  });

  test('should return jwt valid when send email and password valid', async () => {
    const result = await sut.exec({
      email: 'valid@email.com',
      password: '12345678',
    });
    expect(result.success).toBeTruthy();
  });
  test('should return undefined token when send invalid credentials', async () => {
    authRepositoryMock.createAuth.mockResolvedValueOnce({
      success: false,
    });
    const result = await sut.exec({
      email: 'valid@email.com',
      password: '12345678',
    });
    expect(result.success).toBeFalsy();
  });

  test('should return undefined token when send invalid credentials', async () => {
    jest
      .spyOn(authRepositoryMock, 'createAuth')
      .mockImplementationOnce(throwError);
    const promise = await sut.exec(mockRegisterAuthInput());

    expect(promise.success).toBeFalsy();
  });
});
