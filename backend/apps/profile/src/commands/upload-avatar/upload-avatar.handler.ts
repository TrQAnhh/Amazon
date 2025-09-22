import { UploadAvatarCommand } from './upload-avatar.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEntity } from '../../entity/profile.identity';
import { Repository } from 'typeorm';
import { CloudinaryService } from '../../modules/cloudinary/service/cloudinary.service';
import { RpcException } from '@nestjs/microservices';
import { assertExists, ErrorCode } from '@app/common';

@CommandHandler(UploadAvatarCommand)
export class UploadAvatarHandler implements ICommandHandler<UploadAvatarCommand> {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileRepo: Repository<ProfileEntity>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async execute(command: UploadAvatarCommand): Promise<any> {
    const { userId, avatarPayload } = command;

    await assertExists<ProfileEntity>(this.profileRepo, { userId }, ErrorCode.PROFILE_NOT_FOUND);

    if (!avatarPayload) {
      throw new RpcException(ErrorCode.NO_FILE_PROVIDED);
    }

    const avatarUrl = await this.cloudinaryService.uploadImage(avatarPayload.buffer, avatarPayload.filename, avatarPayload.mimetype);

    await this.profileRepo.update({ userId }, { avatarUrl });

    return avatarUrl;
  }
}
