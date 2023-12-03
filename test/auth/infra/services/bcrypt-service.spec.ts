import * as bcrypt from 'bcrypt';
import { BcryptService } from '@/auth/infra/services/bcrypt-service';
import { Test, TestingModule } from '@nestjs/testing';

jest.mock('bcrypt');

// const makeSut = (): BcryptService => {
//   return new BcryptService(salt);
// };

describe('Bcrypt Service', () => {
  const salt = 10;

  let sut: BcryptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: BcryptService,
          useFactory: () => new BcryptService(salt),
        },
      ],
    }).compile();
    sut = module.get(BcryptService);
  });
  describe('encrypt()', () => {
    test('Should return a valid hash on hash success', async () => {
      jest.spyOn(bcrypt, 'hash').mockImplementation(() => 'hash');

      const hash = await sut.encrypt('any_value');
      expect(hash).toEqual({
        hashText: 'hash',
      });
    });
  });

  describe('verifyHash()', () => {
    test('Should return true when compare succeeds', async () => {
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => true);

      const result = await sut.verifyHash('plaintext', 'digest');
      expect(result).toEqual({
        isValid: true,
      });
    });

    test('Should return false when compare fails', async () => {
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => false);

      const result = await sut.verifyHash('any_value', 'digest');
      expect(result).toEqual({
        isValid: false,
      });
    });
  });
});
