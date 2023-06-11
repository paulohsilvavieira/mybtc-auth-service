/* eslint-disable prefer-const */
import { mock, MockProxy } from 'jest-mock-extended';
import { SignInUsecase } from './sign-in-usecase';
import { IVerifyAuthRepo } from '@auth/protocols/repository';

describe('SignIn Usecase', () => {
  let repo: MockProxy<IVerifyAuthRepo>;
  let sut: SignInUsecase;
  beforeAll(() => {
    repo = mock();
    repo.verifyAuth.mockResolvedValue({
      isValid: true,
    });
  });

  beforeEach(() => {
    sut = new SignInUsecase(repo);
  });

  test('should return jwt valid when send email and password valid', async () => {
    const { token } = await sut.exec({
      email: 'valid@email.com',
      password: '12345678',
    });
    expect(token).toEqual('validToken');
  });
  test('should return msg invalid credentials when send  email and password invalid', async () => {
    repo.verifyAuth.mockResolvedValueOnce({ isValid: false });
    const { msg } = await sut.exec({
      email: 'wrongemail@email.com',
      password: 'wrongpassword',
    });
    expect(msg).toEqual('Invalid Credentials!');
  });
});
