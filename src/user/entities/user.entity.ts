import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserEntity {
  @Expose()
  id: string;

  @Expose()
  mail: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  avatar: string;

  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;
}
