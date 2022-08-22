import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length, IsNotEmpty } from 'class-validator';
import { AUTH_VALIDATION_ERRORS } from '../auth.constants';

export class RegistrationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEmail({}, { message: AUTH_VALIDATION_ERRORS.MAIL_INCORRECT })
  readonly mail: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(6, 30, { message: AUTH_VALIDATION_ERRORS.PASSWORD_ERROR_LENGTH })
  readonly password: string;
}
