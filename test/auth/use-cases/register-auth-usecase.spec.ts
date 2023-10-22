/* eslint-disable prefer-const */
import { mock, MockProxy } from 'jest-mock-extended';
import { BcryptProtocol } from '../../../src/auth/protocols/cryptography';
import { AuthRepoProtocol } from '../../../src/auth/protocols/repository';
import { RegisterAuthUsecase } from '../../../src/auth/usecases/register-auth-usecase';
import { Test, TestingModule } from '@nestjs/testing';

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterAuthUsecase,
        {
          provide: AuthRepoProtocol,
          useValue: authRepositoryMock,
        },
        {
          provide: BcryptProtocol,
          useValue: bcryptMock,
        },
      ],
    }).compile();
    sut = module.get(RegisterAuthUsecase);
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
