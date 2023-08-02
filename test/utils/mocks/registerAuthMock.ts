import { faker } from '@faker-js/faker';
import { RegisterAuthUsecaseInput } from '../../../src/auth/protocols/usecases';
export const mockRegisterAuthInput = (): RegisterAuthUsecaseInput => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
});
