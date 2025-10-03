import { ProfileResponseDto } from '@app/common/dto';
import { UserRole } from '@app/common/constants';
import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({ type: 'string' })
  accessToken: string;

  @ApiProperty({ type: 'string' })
  refreshToken: string;

  @ApiProperty({ enum: UserRole })
  role: UserRole;

  @ApiProperty({ type: () => ProfileResponseDto })
  user: ProfileResponseDto;
}
