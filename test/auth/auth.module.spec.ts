import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { IBackup } from 'pg-mem';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationEntity } from '@/auth/infra/database/entities';
import { getAuthToken } from '@/test/utils/mocks/requestToken';
import { makeFakeDb } from '@/test/utils/mocks/database';

import { AuthModule } from '@/auth/auth.module';

describe('Auth Module (e2e)', () => {
  let app: INestApplication;
  let connectionFake: DataSource;
  let backup: IBackup;
  beforeAll(async () => {
    const { db, connection } = await makeFakeDb([AuthenticationEntity]);
    connectionFake = connection;

    backup = db.backup();

    const nestApp: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        AuthModule,
      ],
    })
      .overrideProvider(DataSource)
      .useValue(connectionFake)
      .compile();

    app = nestApp.createNestApplication();
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

    await request(app.getHttpServer()).post('/auth/register').send({
      email: 'email5@email.com',
      password: '123456',
    });

    const { ...user } = await connectionFake
      .getRepository(AuthenticationEntity)
      .findOneBy({ email: 'email5@email.com' });

    expect(user).toEqual({
      id: expect.any(String),
      email: 'email5@email.com',
      password: expect.any(String),
      lastAccessAt: null,
      tokenRecoverPassword: null,
      expirationTimeToken: null,
      otpActive: null,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
    const response = await requestApp.post('/auth/login').send({
      email: 'email5@email.com',
      password: '123456',
    });
    expect(response.body).toEqual({
      token: expect.any(String),
    });
  });

  test('/auth/update/password (PUT)', async () => {
    const requestApp = request(app.getHttpServer());

    const token = await getAuthToken(requestApp);

    requestApp
      .put('/auth/update/password')
      .send({
        email: 'email@mail.com',
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
