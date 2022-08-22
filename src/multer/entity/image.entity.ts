import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { IsString } from 'class-validator';

@Exclude()
export class ImageEntity {
  @ApiProperty()
  @Expose()
  @IsString()
  @Transform(({ obj }) => obj.Location)
  location: string;
}
