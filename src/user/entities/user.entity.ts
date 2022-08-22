import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserEntity {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  mail: string;

  @ApiProperty()
  @Expose()
  firstName: string;

  @ApiProperty()
  @Expose()
  lastName: string;

  @ApiProperty()
  @Expose()
  avatar: string;

  @ApiProperty()
  @Expose()
  accessToken: string;

  @ApiProperty()
  @Expose()
  refreshToken: string;
}
