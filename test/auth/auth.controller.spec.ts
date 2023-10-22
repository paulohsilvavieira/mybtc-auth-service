import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';
import { AuthController } from '../../src/auth/auth.controller';
import { ApiTokenGuard } from '../../src/auth/guards/api-token.guard';
import { JwtProtocol } from '../../src/auth/protocols/cryptography';
import {
  SignInProtocol,
  RegisterAuthProtocol,
  UpdatePasswordUseCaseProtocol,
} from '../../src/auth/protocols/usecases';

describe('AuthController', () => {
  let authController: AuthController;
  let signInUsecaseMock: MockProxy<SignInProtocol>;
  let registerAuthUsecaseMock: MockProxy<RegisterAuthProtocol>;
  let updatePasswordUsecaseMock: MockProxy<UpdatePasswordUseCaseProtocol>;
  let jsonWebTokenMock: MockProxy<JwtProtocol>; // to use with guard
  let apiTokenGuard: ApiTokenGuard;

  beforeAll(() => {
    signInUsecaseMock = mock();
    updatePasswordUsecaseMock = mock();
    registerAuthUsecaseMock = mock();
    jsonWebTokenMock = mock();
    signInUsecaseMock.exec.mockResolvedValue({
      token: 'validToken',
    });
    registerAuthUsecaseMock.exec.mockResolvedValue({ success: true });
    jsonWebTokenMock.verifyToken.mockResolvedValue({
      isValid: true,
      payload: {
        authorizationId: 'dummy',
      },
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
        {
          provide: RegisterAuthProtocol,
          useValue: registerAuthUsecaseMock,
        },
        {
          provide: UpdatePasswordUseCaseProtocol,
          useValue: updatePasswordUsecaseMock,
        },
        {
          provide: JwtProtocol,
          useValue: jsonWebTokenMock,
        },
      ],
    }).compile();
    apiTokenGuard = module.get(ApiTokenGuard);

    jest.spyOn(apiTokenGuard, 'canActivate').mockResolvedValueOnce(true);

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
      const result = authController.login(invalidUserCredentials);
      await expect(result).rejects.toEqual(new UnauthorizedException());
    });
    test('shoud return validToken when send valid credentials', async () => {
      signInUsecaseMock.exec.mockResolvedValueOnce({ token: 'validToken' });
      const validUserCredentials = {
        email: 'validEmail@email.com',
        password: 'validPassword',
      };
      const result = await authController.login(validUserCredentials);
      expect(result.token).toEqual('validToken');
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
      const result = authController.register(authDataToRegister);
      await expect(result).rejects.toEqual(
        new BadRequestException('Error on Create Authentication Info'),
      );
    });
  });
});
