import { AuthenticationRepository } from '@/auth/infra/database/repositories';
import { Repository } from 'typeorm';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthenticationEntity } from '@/auth/infra/database/entities';
import { exec } from 'child_process';

describe('AuthenticationRepository', () => {
  let sut: AuthenticationRepository;
  let authRepositoryMock: Repository<AuthenticationEntity>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthenticationRepository,
        {
          provide: getRepositoryToken(AuthenticationEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    sut = moduleRef.get(AuthenticationRepository);
    authRepositoryMock = moduleRef.get<Repository<AuthenticationEntity>>(
      getRepositoryToken(AuthenticationEntity),
    );
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  test('should call insert function', async () => {
    jest.spyOn(authRepositoryMock, 'insert').mockResolvedValueOnce(null);
    await sut.createAuthenticationInfo({
      email: 'test',
      password: 'test',
    });
    expect(authRepositoryMock.insert).toHaveBeenCalledWith({
      id: expect.any(String),
      email: 'test',
      password: 'test',
    });
  });

  test('should return id of auth info', async () => {
    jest.spyOn(authRepositoryMock, 'findOne').mockResolvedValueOnce({
      id: 'id_auth',
    } as never);
    const result = await sut.getAuthorizationIdWithEmail('test@email.com');
    expect(result.authorizationId).toEqual('id_auth');
  });
  test('should dont return id of auth info ', async () => {
    jest.spyOn(authRepositoryMock, 'findOne').mockResolvedValueOnce(null);
    const result = await sut.getAuthorizationIdWithEmail('test@email.com');
    expect(result.authorizationId).toEqual(null);
  });

  test('should return password', async () => {
    jest.spyOn(authRepositoryMock, 'findOne').mockResolvedValueOnce({
      password: 'any_password',
    } as never);
    const result = await sut.getPasswordToCompre('test@email.com');
    expect(result.password).toEqual('any_password');
  });

  test('should dont return password', async () => {
    jest.spyOn(authRepositoryMock, 'findOne').mockResolvedValueOnce(null);
    const result = await sut.getPasswordToCompre('test@email.com');
    expect(result.password).toEqual(null);
  });

  test('should call update function', async () => {
    jest.spyOn(authRepositoryMock, 'update').mockResolvedValueOnce(null);
    await sut.invalidTokenExpiration('test@email.com');
    expect(authRepositoryMock.update).toHaveBeenCalledWith(
      { email: 'test@email.com' },
      { expirationTimeToken: expect.any(Number) },
    );
  });

  test('should return expirationTimeToken', async () => {
    const dateNow = Date.now();
    jest.spyOn(authRepositoryMock, 'findOne').mockResolvedValueOnce({
      expirationTimeToken: dateNow,
    } as never);
    const result = await sut.getExpirationTimeTokenResetPassword(
      'test@email.com',
    );
    expect(result.expirationTimeToken).toEqual(dateNow);
  });

  test('should call update function on updatePasswordAuth', async () => {
    jest.spyOn(authRepositoryMock, 'update').mockResolvedValueOnce(null);

    await sut.updatePasswordAuth({
      email: 'test@email.com',
      password: 'test',
    });
    expect(authRepositoryMock.update).toHaveBeenCalledWith(
      { email: 'test@email.com' },
      { password: 'test' },
    );
  });

  test('should call update function on saveTokenRecoverPassword', async () => {
    jest.spyOn(authRepositoryMock, 'update').mockResolvedValueOnce(null);

    await sut.saveTokenRecoverPassword({
      email: 'test@email.com',
      tokenRecoverPassword: 'test',
      expirationTimeToken: Date.now(),
    });
    expect(authRepositoryMock.update).toHaveBeenCalledWith(
      { email: 'test@email.com' },
      {
        tokenRecoverPassword: 'test',
        expirationTimeToken: expect.any(Number),
      },
    );
  });

  test('should return true if verifyExistsEmail use a exist email', async () => {
    jest.spyOn(authRepositoryMock, 'findOne').mockResolvedValueOnce({
      id: 'any_id',
    } as never);

    const result = await sut.verifyExistsEmail('test@email.com');
    expect(result).toEqual(true);
  });

  test('should return true if verifyExistsEmail use inexist email', async () => {
    jest.spyOn(authRepositoryMock, 'findOne').mockResolvedValueOnce(null);

    const result = await sut.verifyExistsEmail('test@email.com');
    expect(result).toEqual(false);
  });
});
