import { MockProxy, mock } from 'jest-mock-extended';
import { CreateUserUseCase } from './create-user-usecase';
import { UserRepoProtocol } from '../protocols/repositories';
import { mockCreateUserInput, throwError } from '@tests/utils/mocks';

describe('CreateUserUseCase', () => {
  let userRepositoryMock: MockProxy<UserRepoProtocol>;

  let sut: CreateUserUseCase;
  beforeAll(() => {
    userRepositoryMock = mock();
    userRepositoryMock.createUser.mockResolvedValue({
      success: true,
    });
  });

  beforeEach(() => {
    sut = new CreateUserUseCase(userRepositoryMock);
  });
  test('', () => {});
});
