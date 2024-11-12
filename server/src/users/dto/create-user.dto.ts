import { IsString, IsStrongPassword, Length } from 'class-validator';

export class CreateUserDto {
  @Length(3, 15)
  username: string;

  @IsString()
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'Password is too weak. It must contain at least 8 characters, including uppercase letters, lowercase letters, numbers, and symbols.',
    },
  )
  password: string;
}
