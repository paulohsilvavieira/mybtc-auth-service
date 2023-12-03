import {
  BadRequestException,
  HttpException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { TypeORMError } from 'typeorm';
import {
  ResponseError,
  DomainError,
  InternalServerError,
  AuthenticationError,
} from './exeptions';

export class HttpExceptionMapper {
  static catch(error: any): HttpException {
    if (error instanceof BadRequestException) {
      return error;
    }
    if (error instanceof TypeORMError) {
      return new InternalServerErrorException();
    }

    if (error instanceof DomainError) {
      return new BadRequestException(new ResponseError(error));
    }

    if (error instanceof AuthenticationError) {
      return new UnauthorizedException(new ResponseError(error));
    }

    return new InternalServerErrorException(
      new ResponseError(new InternalServerError()),
    );
  }
}
