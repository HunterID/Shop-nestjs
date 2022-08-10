import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, IsEmail } from 'class-validator';
import { AUTH_VALIDATION_ERRORS } from '../auth.constants';

export class LoginDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEmail({}, { message: AUTH_VALIDATION_ERRORS.EMAIL_INCORRECT })
  readonly mail: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(6, 30, { message: AUTH_VALIDATION_ERRORS.PASSWORD_ERROR_LENGTH })
  readonly password: string;
}
