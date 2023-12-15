import * as request from 'supertest';

export async function getAuthToken(
  app: request.SuperTest<request.Test>,
): Promise<string> {
  await app.post('/auth/register').send({
    email: 'email@mail.com',
    password: '12345678',
  });
  const response = await app.post('/auth/login').send({
    email: 'email@mail.com',
    password: '12345678',
  });

  return response.body.token;
}
