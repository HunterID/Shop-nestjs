import { Exclude, Expose, Transform } from 'class-transformer';
import { IsString } from 'class-validator';

@Exclude()
export class AvatarEntity {
  @Expose()
  @IsString()
  @Transform(({ obj }) => obj.Location)
  location: string;
}
