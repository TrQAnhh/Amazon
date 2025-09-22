import { Module } from '@nestjs/common';
import { CloudinaryProvider } from './service/cloudinary.provider';
import { CloudinaryService } from './service/cloudinary.service';

@Module({
  providers: [CloudinaryProvider, CloudinaryService],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}
