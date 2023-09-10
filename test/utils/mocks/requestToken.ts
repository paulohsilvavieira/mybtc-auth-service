export const getToken = async (app: any): Promise<string> => {
  await app.post('/auth/register').send({
    email: 'email@mail.com',
    password: '12345678',
  });
  const response = await app.post('/auth/login').send({
    email: 'email@mail.com',
    password: '12345678',
  });
  return response.body.token;
};
