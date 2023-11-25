import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { JwtProtocol } from '../../core/domain/protocols/cryptography/jwt';

@Injectable()
export class ApiTokenGuard implements CanActivate {
  constructor(private readonly jwtService: JwtProtocol) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    if (!request.get('Authorization')) return false;

    const authToken = request.get('Authorization').split(' ')[1];

    const { isValid, payload } = await this.jwtService.verifyToken<{
      authorizationId: string;
      email: string;
    }>(authToken);

    if (isValid) {
      request.body.authorizationId = payload.authorizationId;
      request.body.email = payload.email;
    }

    return isValid;
  }
}
