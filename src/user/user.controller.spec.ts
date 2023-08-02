import { Test, TestingModule } from '@nestjs/testing';
import {
  CreateUserProtocol,
  SaveAddressUserProtocol,
  SaveDocumentsUserProtocol,
} from './protocols/usecases';
import { MockProxy, mock } from 'jest-mock-extended';
import { BadRequestException } from '@nestjs/common';
import { UserController } from './user.controller';
import {
  mockCreateUserInput,
  mockSaveAddressUserInput,
  mockSaveDocumentsUserInput,
} from '../../test/utils/mocks';

describe('UserController', () => {
  let userController: UserController;
  let createUserUsecaseMock: MockProxy<CreateUserProtocol>;

  let saveAddressUserUsecaseMock: MockProxy<SaveAddressUserProtocol>;
  let saveDocumentsUserUsecaseMock: MockProxy<SaveDocumentsUserProtocol>;

  beforeAll(() => {
    createUserUsecaseMock = mock();
    saveDocumentsUserUsecaseMock = mock();
    saveAddressUserUsecaseMock = mock();
    createUserUsecaseMock.exec.mockResolvedValue({
      success: true,
    });
    saveDocumentsUserUsecaseMock.exec.mockResolvedValue({
      success: true,
    });
    saveAddressUserUsecaseMock.exec.mockResolvedValue({
      success: true,
    });
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: CreateUserProtocol,
          useValue: createUserUsecaseMock,
        },
        {
          provide: SaveAddressUserProtocol,
          useValue: saveAddressUserUsecaseMock,
        },
        {
          provide: SaveDocumentsUserProtocol,
          useValue: saveDocumentsUserUsecaseMock,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });
  describe('createUser', () => {
    test('shoud return success=true when save basic info', async () => {
      createUserUsecaseMock.exec.mockResolvedValueOnce({
        success: true,
      });

      const result = await userController.saveBasicInfo(mockCreateUserInput());
      expect(result).toEqual({
        msg: 'User Info Saved!',
      });
    });

    test('shoud return success=false when dont save basic info', async () => {
      createUserUsecaseMock.exec.mockResolvedValueOnce({
        success: false,
        error: 'Error on Save User Info',
      });

      const result = userController.saveBasicInfo(mockCreateUserInput());
      await expect(result).rejects.toEqual(
        new BadRequestException('Error on Save User Info'),
      );
    });
  });
  describe('saveAddress', () => {
    test('shoud return success=true when send save address user', async () => {
      saveAddressUserUsecaseMock.exec.mockResolvedValueOnce({ success: true });

      const result = await userController.saveAddress(
        mockSaveAddressUserInput(),
      );
      expect(result).toEqual({
        msg: 'User address info saved!',
      });
    });

    test('shoud return success=false when dont save address user', async () => {
      saveAddressUserUsecaseMock.exec.mockResolvedValueOnce({
        success: false,
        error: 'Error on Save Address User Info',
      });

      const result = userController.saveAddress(mockSaveAddressUserInput());
      await expect(result).rejects.toEqual(
        new BadRequestException('Error on Save Address User Info'),
      );
    });
  });

  describe('saveDocument', () => {
    test('shoud return success=true when save documents user', async () => {
      saveDocumentsUserUsecaseMock.exec.mockResolvedValueOnce({
        success: true,
      });

      const result = await userController.saveDocuments(
        mockSaveDocumentsUserInput(),
      );
      expect(result).toEqual({
        msg: 'User documents info saved!',
      });
    });

    test('shoud return success=false when dont save documents user', async () => {
      saveDocumentsUserUsecaseMock.exec.mockResolvedValueOnce({
        success: false,
        error: 'Error on Save Documents User Info',
      });

      const result = userController.saveDocuments(mockSaveDocumentsUserInput());
      await expect(result).rejects.toEqual(
        new BadRequestException('Error on Save Documents User Info'),
      );
    });
  });
});
