import { Expose } from 'class-transformer';

export class ProfileResponseDto {
  @Expose()
  email: string;

  @Expose()
  firstName: string;

  @Expose()
  middleName?: string;

  @Expose()
  lastName: string;

  @Expose()
  address: string;

  @Expose()
  avatarUrl?: string;

  @Expose()
  bio?: string;
}
