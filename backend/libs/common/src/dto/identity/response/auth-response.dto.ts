import { ProfileResponseDto } from '@app/common/dto';
import { UserRole } from '@app/common/constants';

export class AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  role: UserRole;
  user: ProfileResponseDto;
}
