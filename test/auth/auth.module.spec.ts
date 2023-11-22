import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { makeFakeDb } from '../utils/mocks';
import { DataSource } from 'typeorm';
import { IBackup } from 'pg-mem';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationEntity } from '../../src/database/entities';
import { createNestLogger } from '../../src/config/logger.config';
import { getToken } from '../utils/mocks/requestToken';
import { AuthModule } from '../../src/auth/auth.module';

describe('Auth Module (e2e)', () => {
  let app: INestApplication;
  let connectionFake: DataSource;
  let backup: IBackup;
  beforeAll(async () => {
    const { db, connection } = await makeFakeDb([AuthenticationEntity]);
    connectionFake = connection;

    backup = db.backup();

    const logger = createNestLogger();

    const nestApp: TestingModule = await Test.createTestingModule({
      imports: [
        AuthModule,
        TypeOrmModule.forRoot(),
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        TypeOrmModule.forFeature([AuthenticationEntity]),
      ],
    })
      .overrideProvider(DataSource)
      .useValue(connectionFake)
      .compile();

    app = nestApp.createNestApplication({ logger });

    await app.init();
  });

  beforeEach(async () => {
    backup.restore();
  });

  test('/auth/register (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'email5@email.com',
        password: '123456',
      })
      .expect(201);
  });

  test('/auth/login (POST)', async () => {
    const requestApp = request(app.getHttpServer());

    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'email5@email.com',
        password: '123456',
      })
      .then(async () => {
        const { ...user } = await connectionFake
          .getRepository(AuthenticationEntity)
          .findOneBy({ email: 'email5@email.com' });

        expect(user).toEqual({
          id: expect.any(String),
          email: 'email5@email.com',
          password: expect.any(String),
          last_access_at: null,
          token_recover_password: null,
          expiration_time_token: null,
          otp_active: null,
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
        });
        requestApp
          .post('/auth/login')
          .send({
            email: 'email5@email.com',
            password: '123456',
          })
          .expect((response) => {
            expect(response.body).toBe({
              token: expect.any,
            });
          });
      });
  });

  test('/auth/update/password (PUT)', async () => {
    const requestApp = request(app.getHttpServer());

    const token = await getToken(requestApp);

    requestApp
      .put('/auth/update/password')
      .send({
        oldPassword: '12345678',
        newPassword: '123456',
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
