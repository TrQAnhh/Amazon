import { Expose } from 'class-transformer';

export class AdminProfileResponseDto {
  @Expose()
  email: string;

  @Expose()
  userId: number;

  @Expose()
  firstName: string;

  @Expose()
  middleName?: string;

  @Expose()
  lastName: string;

  @Expose()
  avatarUrl?: string;

  @Expose()
  bio?: string;
}
