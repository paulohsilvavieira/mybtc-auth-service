import { AuthenticationRepository } from './authentication-repository';
import { DataSource, Repository } from 'typeorm';
import { AuthenticationEntity } from '@entities/AuthenticationEntity';
import { Test } from '@nestjs/testing';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
import { IVerifyAuthRepo } from '@auth/protocols/repository';
import { IBackup } from 'pg-mem';
import { makeFakeDb } from '@tests/mocks/database';

describe('AuthenticationRepository', () => {
  let connectionFake: DataSource;
  let sut: AuthenticationRepository;

  let backup: IBackup;
  beforeAll(async () => {
    const { db, connection } = await makeFakeDb();
    backup = db.backup();
    connectionFake = connection;
  });

  afterAll(async () => {
    await connectionFake.destroy();
  });

  beforeEach(async () => {
    backup.restore();
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthenticationRepository,
        {
          provide: AuthenticationRepository,
          useFactory: () => {
            return new AuthenticationRepository(
              connectionFake.getRepository(AuthenticationEntity),
            );
          },
          inject: [getDataSourceToken()],
        },
        {
          provide: IVerifyAuthRepo,
          useClass: AuthenticationRepository,
        },
      ],
      imports: [
        TypeOrmModule.forFeature([
          AuthenticationEntity,
          Repository<AuthenticationEntity>,
        ]),
        TypeOrmModule.forRoot({
          name: 'default',
          synchronize: true,
        }),
      ],
    })
      .overrideProvider(DataSource)
      .useValue(connectionFake)
      .compile();
    sut = moduleRef.get<AuthenticationRepository>(AuthenticationRepository);
  });

  test('should return  isValid: false a invalid user', async () => {
    jest.spyOn(sut, 'verifyAuth').mockResolvedValue({
      isValid: false,
    });
    const result = await sut.verifyAuth({ email: 'test', password: 'test2' });

    expect(result).toEqual({
      isValid: false,
    });
  });
  test('should return  isValid: true is a valid user', async () => {
    const result = await sut.verifyAuth({ email: 'test', password: 'test2' });
    expect(result).toEqual({
      isValid: true,
    });
  });
});
