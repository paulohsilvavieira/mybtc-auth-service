/* eslint-disable prefer-const */
import { mock, MockProxy } from 'jest-mock-extended';
import { Bcrypt } from '@/auth/core/domain/protocols/cryptography';
import { AuthRepoProtocol } from '@/auth/core/domain/protocols/repository';
import { RegisterAuthUsecase } from '@/auth/core/application/usecases/register-auth-usecase';
import { Test, TestingModule } from '@nestjs/testing';

describe('Register Auth Usecase', () => {
  let authRepositoryMock: MockProxy<AuthRepoProtocol>;
  let bcryptMock: MockProxy<Bcrypt>;

  let sut: RegisterAuthUsecase;
  beforeAll(() => {
    authRepositoryMock = mock();
    bcryptMock = mock();
    authRepositoryMock.createAuthenticationInfo.mockResolvedValue();
    bcryptMock.encrypt.mockResolvedValue({
      hashText: 'digest',
    });
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterAuthUsecase,
        {
          provide: AuthRepoProtocol,
          useValue: authRepositoryMock,
        },
        {
          provide: Bcrypt,
          useValue: bcryptMock,
        },
      ],
    }).compile();
    sut = module.get(RegisterAuthUsecase);
  });

  test('Should return "message: Authentication created!" repository save successfull', async () => {
    const result = await sut.execute({
      email: 'valid@email.com',
      password: '123456',
    });
    expect(result.message).toEqual('Authentication created!');
  });
});
