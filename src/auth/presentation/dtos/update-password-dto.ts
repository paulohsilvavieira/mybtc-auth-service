import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdatePasswordDTO {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  oldPassword: string;

  @IsNotEmpty()
  newPassword: string;
}
