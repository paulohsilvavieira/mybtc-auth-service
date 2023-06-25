import { BcryptProtocol } from '@auth/protocols/cryptography';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService implements BcryptProtocol {
  constructor(private readonly salt: number) {}

  async encrypt(plaintext: string): Promise<{ hashText: string }> {
    return {
      hashText: await bcrypt.hash(plaintext, this.salt),
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
