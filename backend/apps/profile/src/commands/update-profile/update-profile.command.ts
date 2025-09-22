import { UpdateProfileDto } from '@app/common';

export class UpdateProfileCommand {
  constructor(
    public readonly userId: number,
    public readonly updateProfileDto: UpdateProfileDto,
  ) {}
}
