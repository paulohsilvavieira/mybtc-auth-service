import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { BcryptProtocol } from '../protocols/cryptography';

@Injectable()
export class BcryptService implements BcryptProtocol {
  constructor(private readonly salt: number) {}
  async encrypt(plaintext: string): Promise<{ hashText: string }> {
    const hashText = await bcrypt.hash(plaintext, this.salt);
    return {
      hashText,
    };
  }

  async verifyHash(
    plaintext: string,
    digest: string,
  ): Promise<{ isValid: boolean }> {
    return {
      isValid: await bcrypt.compare(plaintext, digest),
    };
  }
}
