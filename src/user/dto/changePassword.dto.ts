import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsNotEmpty } from 'class-validator';
import { AUTH_VALIDATION_ERRORS } from '../../auth/auth.constants';

export class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(6, 30, { message: AUTH_VALIDATION_ERRORS.PASSWORD_ERROR_LENGTH })
  readonly password: string;
}
