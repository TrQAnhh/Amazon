import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import { RpcException } from '@nestjs/microservices';
import { ErrorCode } from '@app/common';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  async uploadImage(base64Buffer: string, filename: string, mimetype: string): Promise<string> {
    const buffer = Buffer.from(base64Buffer, 'base64');
    const stream = Readable.from(buffer);

    const result = await new Promise<UploadApiResponse | UploadApiErrorResponse>((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        {
          resource_type: 'image',
          public_id: filename,
          folder: 'avatars',
        },
        (error, result) => {
          if (error) return reject(new RpcException(error));
          if (!result) return reject(new RpcException(ErrorCode.CLOUDINARY_NO_RESULT));
          resolve(result);
        },
      );

      stream.pipe(upload);
    });

    return result.secure_url;
  }
}
