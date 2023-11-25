import { Module } from '@nestjs/common';
import { InfraModule } from '../infra/infra.module';
import {
  RegisterAuthProtocol,
  ResetPasswordProtocol,
  SendTokenRecoverPasswordProtocol,
  SignInProtocol,
  UpdatePasswordProtocol,
} from './domain/protocols/usecases';
import {
  RegisterAuthUsecase,
  ResetPasswordUseCase,
  SendTokenRecoverPasswordUsecase,
  SignInUsecase,
  UpdatePasswordUseCase,
} from './application/usecases';

@Module({
  imports: [InfraModule],
  providers: [
    {
      provide: SignInProtocol,
      useClass: SignInUsecase,
    },
    {
      provide: RegisterAuthProtocol,
      useClass: RegisterAuthUsecase,
    },
    {
      provide: ResetPasswordProtocol,
      useClass: ResetPasswordUseCase,
    },
    {
      provide: SendTokenRecoverPasswordProtocol,
      useClass: SendTokenRecoverPasswordUsecase,
    },
    {
      provide: UpdatePasswordProtocol,
      useClass: UpdatePasswordUseCase,
    },
  ],
  exports: [
    UpdatePasswordProtocol,
    SendTokenRecoverPasswordProtocol,
    ResetPasswordProtocol,
    RegisterAuthProtocol,
    SignInProtocol,
    InfraModule,
  ],
})
export class CoreModule {}
