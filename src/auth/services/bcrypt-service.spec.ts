import * as bcrypt from 'bcrypt';
import { BcryptService } from './bcrypt-service';

jest.mock('bcrypt');

const salt = 10;
const makeSut = (): BcryptService => {
  return new BcryptService(salt);
};

describe('Bcrypt Service', () => {
  describe('encrypt()', () => {
    test('Should return a valid hash on hash success', async () => {
      jest.spyOn(bcrypt, 'hash').mockImplementation(() => 'hash');

      const sut = makeSut();
      const hash = await sut.encrypt('any_value');
      expect(hash).toEqual({
        hashText: 'hash',
      });
    });
  });

  describe('verifyHash()', () => {
    test('Should return true when compare succeeds', async () => {
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => true);

      const sut = makeSut();
      const result = await sut.verifyHash('plaintext', 'digest');
      expect(result).toEqual({
        isValid: true,
      });
    });

    test('Should return false when compare fails', async () => {
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => false);

      const sut = makeSut();
      const result = await sut.verifyHash('any_value', 'digest');
      expect(result).toEqual({
        isValid: false,
      });
    });
  });
});
