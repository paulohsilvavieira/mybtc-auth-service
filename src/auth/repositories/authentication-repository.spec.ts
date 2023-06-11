import { AuthenticationRepository } from './authentication-repository';
import { Repository } from 'typeorm';
import { AuthenticationEntity } from '@entities/AuthenticationEntity';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

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

    sut = moduleRef.get<AuthenticationRepository>(AuthenticationRepository);
    authRepositoryMock = moduleRef.get<Repository<AuthenticationEntity>>(
      getRepositoryToken(AuthenticationEntity),
    );
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  test('should return  isValid: false a invalid user', async () => {
    jest.spyOn(authRepositoryMock, 'findOneBy').mockResolvedValue(null);
    const result = await sut.verifyAuth({ email: 'test', password: 'test2' });
    expect(result).toEqual({
      isValid: false,
    });
  });
  test('should return  isValid: true is a valid user', async () => {
    jest
      .spyOn(authRepositoryMock, 'findOneBy')
      .mockResolvedValue({ id: 'teste', email: 'test', password: 'test2' });

    const result = await sut.verifyAuth({ email: 'test', password: 'test2' });
    expect(result).toEqual({
      isValid: true,
    });
  });
});
