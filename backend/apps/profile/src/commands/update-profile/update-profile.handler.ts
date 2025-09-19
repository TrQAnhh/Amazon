import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ErrorCode, ProfileResponseDto, SERVICE_NAMES } from '@app/common';
import { UpdateProfileCommand } from './update-profile.command';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEntity } from '../../entity/profile.identity';
import { Repository } from 'typeorm';
import { CloudinaryService } from '../../modules/cloudinary/service/cloudinary.service';
import { Inject } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Readable } from 'node:stream';

@CommandHandler(UpdateProfileCommand)
export class UpdateProfileHandler implements ICommandHandler<UpdateProfileCommand> {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileRepo: Repository<ProfileEntity>,
    private readonly cloudinaryService: CloudinaryService,
    @Inject(SERVICE_NAMES.IDENTITY) private readonly identityClient: ClientProxy,
  ) {}

  async execute(command: UpdateProfileCommand): Promise<ProfileResponseDto> {
    const { userId, updateProfileDto, avatarPayload } = command;

    const existingProfile = await this.profileRepo.findOne({ where: { userId } });
    if (!existingProfile) {
      throw new RpcException(ErrorCode.PROFILE_NOT_FOUND);
    }

    let avatarUrl: string | null = null;
    if (avatarPayload) {
      const buffer = Buffer.from(avatarPayload.buffer, 'base64');
      const file: Express.Multer.File = {
        fieldname: 'avatar',
        originalname: avatarPayload.filename,
        encoding: '7bit',
        mimetype: avatarPayload.mimetype,
        buffer,
        size: buffer.length,
        destination: '',
        filename: '',
        path: '',
        stream: Readable.from(buffer),
      };
      avatarUrl = await this.cloudinaryService.uploadImage(file);
    }

    const profile = await this.profileRepo.save({
      ...existingProfile,
      ...updateProfileDto,
      ...(avatarUrl && { avatarUrl }),
    });

    let email: string;
    try {
      const identity = await firstValueFrom(this.identityClient.send({ cmd: 'get_user_identity' }, { userId }));
      email = identity.email;
    } catch (error) {
      console.error(error);
      throw new RpcException(ErrorCode.IDENTITY_SERVICE_UNAVAILABLE);
    }

    return {
      ...profile,
      email,
    };
  }
}
