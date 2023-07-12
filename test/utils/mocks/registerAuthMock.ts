import { RegisterAuthUsecaseInput } from '@auth/protocols/usecases';
import { faker } from '@faker-js/faker';
export const mockRegisterAuthInput = (): RegisterAuthUsecaseInput => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
});
