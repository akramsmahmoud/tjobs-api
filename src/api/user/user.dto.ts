import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  public name: string;

  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @IsString()
  public password: string;
}
