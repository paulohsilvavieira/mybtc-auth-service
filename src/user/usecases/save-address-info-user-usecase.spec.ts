import { MockProxy, mock } from 'jest-mock-extended';
import { UserRepoProtocol } from '../protocols/repositories';
import {
  mockSaveAddressUserInput,
  throwError,
} from '../../../test/utils/mocks';
import { SaveAddressUserUseCase } from './save-address-info-user-usecase';

describe('SaveAddressUserUseCase', () => {
  let userRepositoryMock: MockProxy<UserRepoProtocol>;

  let sut: SaveAddressUserUseCase;
  beforeAll(() => {
    userRepositoryMock = mock();
    userRepositoryMock.saveAddressUser.mockResolvedValue({
      success: true,
    });
  });

  beforeEach(() => {
    sut = new SaveAddressUserUseCase(userRepositoryMock);
  });

  test('should return throw error on dont save user address', async () => {
    jest
      .spyOn(userRepositoryMock, 'saveAddressUser')
      .mockImplementationOnce(throwError);
    const promise = sut.exec(mockSaveAddressUserInput());

    expect(promise).rejects.toThrow();
  });

  test('should return error when dont save user address record on repository', async () => {
    userRepositoryMock.saveAddressUser.mockResolvedValueOnce({
      success: false,
      error: 'Error on save user record',
    });
    const result = await sut.exec(mockSaveAddressUserInput());

    expect(result).toEqual({
      success: false,
      error: 'Error on save user record',
    });
  });

  test('should return success if save  sucessfull user address on repo', async () => {
    const result = await sut.exec(mockSaveAddressUserInput());

    expect(result).toEqual({
      success: true,
    });
  });
});
