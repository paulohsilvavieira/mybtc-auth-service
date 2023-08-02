import { Repository } from 'typeorm';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserRepository } from './user-repository';
import { UserEntity } from '../../database/entities';
import {
  mockCreateUserInput,
  mockSaveAddressUserInput,
  mockSaveDocumentsUserInput,
} from '../../../test/utils/mocks';

describe('UserRepository', () => {
  let sut: UserRepository;
  let authRepositoryMock: Repository<UserEntity>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      providers: [
        UserRepository,
        {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    sut = moduleRef.get<UserRepository>(UserRepository);
    authRepositoryMock = moduleRef.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  test('should return success: true, if save user info', async () => {
    jest.spyOn(authRepositoryMock, 'update').mockResolvedValue({
      affected: 1,
      raw: 'any',
      generatedMaps: {} as any,
    });

    const result = await sut.createUser(mockCreateUserInput());

    expect(result).toEqual({
      success: true,
    });
  });

  test('should return success: false, if dont save user info', async () => {
    jest.spyOn(authRepositoryMock, 'update').mockResolvedValue({
      affected: 0,
      raw: 'any',
      generatedMaps: {} as any,
    });
    const result = await sut.createUser(mockCreateUserInput());

    expect(result).toEqual({
      success: false,
      error: 'Error on Save User Info',
    });
  });

  test('should return success: true, if save user address', async () => {
    jest.spyOn(authRepositoryMock, 'update').mockResolvedValue({
      affected: 1,
      raw: 'any',
      generatedMaps: {} as any,
    });

    const result = await sut.saveAddressUser(mockSaveAddressUserInput());

    expect(result).toEqual({
      success: true,
    });
  });

  test('should return success: false, if dont save user address info', async () => {
    jest.spyOn(authRepositoryMock, 'update').mockResolvedValue({
      affected: 0,
      raw: 'any',
      generatedMaps: {} as any,
    });
    const result = await sut.saveAddressUser(mockSaveAddressUserInput());

    expect(result).toEqual({
      success: false,
      error: 'Error on Save Address User Info',
    });
  });

  test('should return success: true, if save user documents info', async () => {
    jest.spyOn(authRepositoryMock, 'update').mockResolvedValue({
      affected: 1,
      raw: 'any',
      generatedMaps: {} as any,
    });

    const result = await sut.saveDocuments(mockSaveDocumentsUserInput());

    expect(result).toEqual({
      success: true,
    });
  });

  test('should return success: false, if dont save user documents info', async () => {
    jest.spyOn(authRepositoryMock, 'update').mockResolvedValue({
      affected: 0,
      raw: 'any',
      generatedMaps: {} as any,
    });
    const result = await sut.saveDocuments(mockSaveDocumentsUserInput());

    expect(result).toEqual({
      success: false,
      error: 'Error on Save Documents User Info',
    });
  });
});
