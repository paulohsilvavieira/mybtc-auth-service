import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { SignInProtocol } from './protocols/usecases';
import { MockProxy, mock } from 'jest-mock-extended';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let signInUsecaseMock: MockProxy<SignInProtocol>;
  beforeAll(() => {
    signInUsecaseMock = mock();

    signInUsecaseMock.exec.mockResolvedValue({
      token: 'validToken',
    });
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: SignInProtocol,
          useValue: signInUsecaseMock,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });
  test('shoud return UnauthorizedException when send invalid credentials', async () => {
    signInUsecaseMock.exec.mockResolvedValueOnce({ token: undefined });

    const invalidUserCredentials = {
      email: 'invalidEmail@email.com',
      password: 'invalidPassword',
    };
    const result = await authController.login(invalidUserCredentials);
    expect(result).toEqual(new UnauthorizedException());
  });
  test('shoud return validToken when send valid credentials', async () => {
    signInUsecaseMock.exec.mockResolvedValueOnce({ token: 'validToken' });
    const validUserCredentials = {
      email: 'validEmail@email.com',
      password: 'validPassword',
    };
    const result = await authController.login(validUserCredentials);
    expect(result).toEqual('validToken');
  });
});
