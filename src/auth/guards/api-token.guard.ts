import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AuthRepoProtocol } from '../protocols/repository';
import { JwtProtocol } from '../protocols/cryptography/jwt';

@Injectable()
export class ApiTokenGuard implements CanActivate {
  constructor(private readonly jwt: JwtProtocol) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authToken = request.get('Authorization').split(' ')[1];
    const { isValid, payload } = await this.jwt.verifyToken<{
      authorizationId: string;
    }>(authToken);

    if (isValid) {
      request.body.authorizationId = payload.authorizationId;
    }

    return isValid;
  }
}
