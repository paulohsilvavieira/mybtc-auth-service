import { faker } from '@faker-js/faker';
import { CreateUserUsecaseInput } from 'src/user/protocols/usecases';

export const mockCreateUserInput = (): CreateUserUsecaseInput => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  phoneNumber: faker.phone.number(),
  authenticationId: faker.string.uuid(),
});
