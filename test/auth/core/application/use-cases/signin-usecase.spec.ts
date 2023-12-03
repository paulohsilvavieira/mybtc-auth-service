/* eslint-disable prefer-const */
import { mock, MockProxy } from 'jest-mock-extended';
import { SignInUsecase } from '@/auth/core/application/usecases/signin-usecase';
import { Bcrypt, JwtProtocol } from '@/auth/core/domain/protocols/cryptography';
import { AuthRepoProtocol } from '@/auth/core/domain/protocols/repository';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationParamsInvalidException } from '@/auth/core/domain/exceptions';

describe('SignIn Usecase', () => {
  let authRepositoryMock: MockProxy<AuthRepoProtocol>;
  let bcryptMock: MockProxy<Bcrypt>;
  let jsonWebTokenMock: MockProxy<JwtProtocol>;

  let sut: SignInUsecase;
  beforeAll(() => {
    authRepositoryMock = mock();
    bcryptMock = mock();
    jsonWebTokenMock = mock();
    authRepositoryMock.getPasswordToCompre.mockResolvedValue({
      password: 'any_password',
    });
    authRepositoryMock.getAuthorizationIdWithEmail.mockResolvedValue({
      authorizationId: 'any_id',
    });
    bcryptMock.verifyHash.mockResolvedValue({
      isValid: true,
    });
    jsonWebTokenMock.createToken.mockResolvedValue({
      token: 'validToken',
    });
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignInUsecase,
        {
          provide: AuthRepoProtocol,
          useValue: authRepositoryMock,
        },
        {
          provide: Bcrypt,
          useValue: bcryptMock,
        },
        {
          provide: JwtProtocol,
          useValue: jsonWebTokenMock,
        },
      ],
    }).compile();

    sut = module.get(SignInUsecase);
  });
  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  test('should return jwt valid when send email and password valid', async () => {
    const { token } = await sut.execute({
      email: 'valid@email.com',
      password: '12345678',
    });
    expect(token).toEqual('validToken');
  });

  test('should return undefined token when dont send valid email credential', async () => {
    authRepositoryMock.getPasswordToCompre.mockResolvedValueOnce({
      password: undefined,
    });
    bcryptMock.verifyHash.mockResolvedValue({
      isValid: false,
    });

    try {
      await sut.execute({
        email: 'wrongemail@email.com',
        password: 'wrongpassword',
      });
    } catch (error) {
      expect(error).toEqual(new AuthenticationParamsInvalidException());
    }
  });
});
