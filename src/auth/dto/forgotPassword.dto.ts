import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AUTH_VALIDATION_ERRORS } from '../auth.constants';

export class ForgotPasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEmail({}, { message: AUTH_VALIDATION_ERRORS.MAIL_INCORRECT })
  readonly mail: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly code?: string;
}
