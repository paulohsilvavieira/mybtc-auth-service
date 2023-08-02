import { MockProxy, mock } from 'jest-mock-extended';
import { UserRepoProtocol } from '../protocols/repositories';
import {
  mockSaveDocumentsUserInput,
  throwError,
} from '../../../test/utils/mocks';
import { SaveDocumentsUserUseCase } from './save-documents-user-usecase';

describe('SaveDocumentsUser', () => {
  let userRepositoryMock: MockProxy<UserRepoProtocol>;

  let sut: SaveDocumentsUserUseCase;
  beforeAll(() => {
    userRepositoryMock = mock();
    userRepositoryMock.saveDocuments.mockResolvedValue({
      success: true,
    });
  });

  beforeEach(() => {
    sut = new SaveDocumentsUserUseCase(userRepositoryMock);
  });

  test('should return throw error on dont save user documents', async () => {
    jest
      .spyOn(userRepositoryMock, 'saveDocuments')
      .mockImplementationOnce(throwError);
    const promise = sut.exec(mockSaveDocumentsUserInput());

    expect(promise).rejects.toThrow();
  });

  test('should return error when dont save user documents record on repository', async () => {
    userRepositoryMock.saveDocuments.mockResolvedValueOnce({
      success: false,
      error: 'Error on Save Documents User Info',
    });
    const result = await sut.exec(mockSaveDocumentsUserInput());

    expect(result).toEqual({
      success: false,
      error: 'Error on Save Documents User Info',
    });
  });

  test('should return success if save  sucessfull user documents on repo', async () => {
    const result = await sut.exec(mockSaveDocumentsUserInput());

    expect(result).toEqual({
      success: true,
    });
  });
});
