import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { RegisterAuthProtocol, SignInProtocol } from './protocols/usecases';
import { MockProxy, mock } from 'jest-mock-extended';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let signInUsecaseMock: MockProxy<SignInProtocol>;

  let registerAuthUsecaseMock: MockProxy<RegisterAuthProtocol>;
  beforeAll(() => {
    signInUsecaseMock = mock();
    registerAuthUsecaseMock = mock();
    signInUsecaseMock.exec.mockResolvedValue({
      token: 'validToken',
    });
    registerAuthUsecaseMock.exec.mockResolvedValue({ success: true });
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: SignInProtocol,
          useValue: signInUsecaseMock,
        },
        {
          provide: RegisterAuthProtocol,
          useValue: registerAuthUsecaseMock,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });
  describe('login', () => {
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
  describe('register', () => {
    test('shoud return success=true when send auth info to save', async () => {
      registerAuthUsecaseMock.exec.mockResolvedValueOnce({ success: true });
      const authDataToRegister = {
        email: 'validEmail@email.com',
        password: 'validPassword',
      };
      const result = await authController.register(authDataToRegister);
      expect(result).toEqual({
        msg: 'User Created!',
      });
    });

    test('shoud return success=false when send auth info to save', async () => {
      registerAuthUsecaseMock.exec.mockResolvedValueOnce({ success: false });
      const authDataToRegister = {
        email: 'validEmail@email.com',
        password: 'validPassword',
      };
      const result = await authController.register(authDataToRegister);
      expect(result).toEqual(new BadRequestException());
    });
  });
});
