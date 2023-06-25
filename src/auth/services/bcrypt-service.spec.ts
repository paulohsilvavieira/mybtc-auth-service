import { BcryptService } from '@auth/services/bcrypt-service';

import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return 'hash';
  },

  async compare(): Promise<boolean> {
    return true;
  },
}));

const salt = 10;
const makeSut = (): BcryptService => {
  return new BcryptService(salt);
};

describe('Bcrypt Service', () => {
  describe('encrypt()', () => {
    test('Should return a valid hash on hash success', async () => {
      const sut = makeSut();
      const hash = await sut.encrypt('any_value');
      expect(hash).toEqual({
        hashText: 'hash',
      });
    });
  });

  describe('verifyHash()', () => {
    test('Should return true when compare succeeds', async () => {
      const sut = makeSut();
      const result = await sut.verifyHash('plaintext', 'digest');
      expect(result).toEqual({
        isValid: true,
      });
    });

    test('Should return false when compare fails', async () => {
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => false);

      const sut = makeSut();
      const result = await sut.verifyHash('any_value', 'digest');
      expect(result).toEqual({
        isValid: false,
      });
    });
  });
});
