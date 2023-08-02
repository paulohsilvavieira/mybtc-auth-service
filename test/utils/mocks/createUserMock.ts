import { faker } from '@faker-js/faker';
import {
  CreateUserUsecaseInput,
  SaveAddressUserUsecaseInput,
  SaveDocumentsUserUsecaseInput,
} from 'src/user/protocols/usecases';

export const mockCreateUserInput = (): CreateUserUsecaseInput => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  phoneNumber: faker.phone.number(),
  authenticationId: faker.string.uuid(),
});

export const mockSaveAddressUserInput = (): SaveAddressUserUsecaseInput => ({
  address: faker.location.streetAddress(),
  state: faker.location.state(),
  country: faker.location.country(),
  proofAddress: faker.image.urlLoremFlickr(),
  authenticationId: faker.string.uuid(),
});

export const mockSaveDocumentsUserInput =
  (): SaveDocumentsUserUsecaseInput => ({
    document: faker.string.alpha(),
    typeDocument: faker.string.alpha(),
    proofDocumentBack: faker.image.urlLoremFlickr(),
    proofDocumentFront: faker.image.urlLoremFlickr(),
    authenticationId: faker.string.uuid(),
  });
