import { AuthenticationRepository } from './authentication-repository';
import { Repository } from 'typeorm';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthenticationEntity } from '../../database/entities';

describe('AuthenticationRepository', () => {
  let sut: AuthenticationRepository;
  let authRepositoryMock: Repository<AuthenticationEntity>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
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
    const result = await sut.verifyAuthByEmail({
      email: 'test',
    });
    expect(result).toEqual({
      isValidEmail: false,
      password: undefined,
    });
  });
  test('should return  isValid: true is a valid user', async () => {
    jest.spyOn(authRepositoryMock, 'findOneBy').mockResolvedValue({
      id: 'teste',
      email: 'test',
      password: 'test2',
      created_at: new Date(),
      updated_at: new Date(),
    });

    const result = await sut.verifyAuthByEmail({
      email: 'test',
    });

    expect(result).toEqual({
      isValidEmail: true,
      password: 'test2',
      authorizationId: 'teste',
    });
  });

  test('should return  success: true when register auth', async () => {
    jest.spyOn(authRepositoryMock, 'create').mockReturnValue({
      id: 'test',
      email: 'test',
      password: 'test',
    } as never);

    jest.spyOn(authRepositoryMock, 'insert').mockResolvedValue({
      email: 'test',
      password: 'test',
    } as never);

    const result = await sut.createAuth({
      email: 'test',
      password: 'test',
    });

    expect(result.success).toBeTruthy();
  });
});
