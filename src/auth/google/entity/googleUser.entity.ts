import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class UserGoogleEntity {
  @Transform(({ obj }) => obj.id)
  @Expose()
  googleId: string;

  @Transform(({ obj }) => obj.email)
  @Expose()
  mail: string;

  @Transform(({ obj }) => obj.given_name)
  @Expose()
  firstName: string;

  @Transform(({ obj }) => obj.family_name)
  @Expose()
  lastName: string;

  @Transform(({ obj }) => obj.picture)
  @Expose()
  avatar: string;
}
