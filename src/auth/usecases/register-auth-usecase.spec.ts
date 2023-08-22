/* eslint-disable prefer-const */
import { mock, MockProxy } from 'jest-mock-extended';
import { BcryptProtocol } from '../protocols/cryptography';
import { AuthRepoProtocol } from '../protocols/repository';
import { RegisterAuthUsecase } from './register-auth-usecase';

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

  test('Should return success=true repository save successfull', async () => {
    const result = await sut.exec({
      email: 'valid@email.com',
      password: '123456',
    });
    expect(result.success).toBeTruthy();
  });
  test('Should return success=false repository dont save successfull', async () => {
    authRepositoryMock.createAuth.mockResolvedValueOnce({
      success: false,
    });
    const result = await sut.exec({
      email: 'valid@email.com',
      password: '123456',
    });
    expect(result.success).toBeFalsy();
  });
});
