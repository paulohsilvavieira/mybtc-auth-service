import { AuthenticationParams } from '@/auth/core/domain/entities/auth-info';
import { faker } from '@faker-js/faker';
export const mockRegisterAuthInput = (): AuthenticationParams => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
});
