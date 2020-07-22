import { IsNotEmpty } from 'class-validator';

export class SignUpUserDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  userName: string;
}
