import { CloudinaryService, ErrorCode, RepositoryService } from '@app/common';
import { UploadAvatarCommand } from './upload-avatar.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RpcException } from '@nestjs/microservices';

@CommandHandler(UploadAvatarCommand)
export class UploadAvatarHandler implements ICommandHandler<UploadAvatarCommand> {
  constructor(
    private readonly repository: RepositoryService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async execute(command: UploadAvatarCommand): Promise<string> {
    const { userId, avatarPayload } = command;

    const profile = await this.repository.profile.findByUserId(userId);

    if(!profile) {
        throw new RpcException(ErrorCode.PROFILE_NOT_FOUND);
    }

    if (!avatarPayload) {
      throw new RpcException(ErrorCode.NO_FILE_PROVIDED);
    }

    const avatarUrl = await this.cloudinaryService.uploadImage(
      avatarPayload.buffer,
      avatarPayload.filename,
      avatarPayload.mimetype,
    );

    await this.repository.profile.updateByUserId(userId ,{avatarUrl});
    return avatarUrl;
  }
}
