import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  newPassword: string;

  @IsNotEmpty()
  tokenRecoverPassword: string;
}
