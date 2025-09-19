import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UploadAvatarEvent } from '@app/common';
import { ProfileEntity } from '../entity/profile.identity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from '../modules/cloudinary/service/cloudinary.service';
import { Readable } from 'node:stream';

@EventsHandler(UploadAvatarEvent)
export class UploadAvatarEventHandler implements IEventHandler<UploadAvatarEvent> {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileRepo: Repository<ProfileEntity>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async handle(event: UploadAvatarEvent) {
    const { userId, avatarPayload } = event;

    const profile = await this.profileRepo.findOne({ where: { userId } });
    if (!profile) {
      console.warn(`[UploadAvatarEventHandler] Profile not found for userId=${userId}`);
      return;
    }

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

    const avatarUrl = await this.cloudinaryService.uploadImage(file);

    await this.profileRepo.update({ userId }, { avatarUrl });
  }
}
