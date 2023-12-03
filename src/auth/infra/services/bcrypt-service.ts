import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Bcrypt } from '../../core/domain/protocols/cryptography';

@Injectable()
export class BcryptService implements Bcrypt {
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
