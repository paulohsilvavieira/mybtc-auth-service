import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, catchError, throwError } from 'rxjs';
import { HttpExceptionMapper } from './http.exception.mapper';

export class ExceptionInterceptor implements NestInterceptor {
  intercept(
    _context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    return next.handle().pipe(
      catchError((exception) => {
        const error = HttpExceptionMapper.catch(exception);
        return throwError(() => error);
      }),
    );
  }
}
