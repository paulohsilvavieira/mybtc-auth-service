import { MockProxy, mock } from 'jest-mock-extended';
import { CreateUserUseCase } from './create-user-usecase';
import { UserRepoProtocol } from '../protocols/repositories';
import { mockCreateUserInput, throwError } from '../../../test/utils/mocks';

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

  test('should return throw error on dont save user', async () => {
    jest
      .spyOn(userRepositoryMock, 'createUser')
      .mockImplementationOnce(throwError);
    const promise = sut.exec(mockCreateUserInput());

    expect(promise).rejects.toThrow();
  });

  test('should return error when dont save user record on repository', async () => {
    userRepositoryMock.createUser.mockResolvedValueOnce({
      success: false,
      error: 'Error on save user record',
    });
    const result = await sut.exec(mockCreateUserInput());

    expect(result).toEqual({
      success: false,
      error: 'Error on save user record',
    });
  });

  test('should return success if save sucessfull user on repo', async () => {
    const result = await sut.exec(mockCreateUserInput());

    expect(result).toEqual({
      success: true,
    });
  });
});
