import { Inject, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtProtocol } from '../protocols/cryptography';

@Injectable()
export class JsonWebTokenService implements JwtProtocol {
  private readonly logger = new Logger(JsonWebTokenService.name);

  constructor(@Inject(JwtService) private jwtService: JwtService) {}

  async createToken(payload: any): Promise<{ token: string }> {
    const token = await this.jwtService.signAsync(payload);
    return { token };
  }
  async verifyToken(
    token: string,
  ): Promise<{ isValid: boolean; payload: any }> {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      return {
        isValid: true,
        payload,
      };
    } catch (error) {
      return {
        isValid: false,
        payload: undefined,
      };
    }
  }
}
