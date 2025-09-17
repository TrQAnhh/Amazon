import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream from 'buffer-to-stream';
import {RpcException} from "@nestjs/microservices";

@Injectable()
export class CloudinaryService {
    async uploadImage(file: Express.Multer.File): Promise<string> {

        const result = await new Promise<UploadApiResponse | UploadApiErrorResponse>((resolve, reject) => {
            const upload = v2.uploader.upload_stream((error, result) => {
                if (error) return reject(error);
                if (!result) return reject(new RpcException('No result from Cloudinary'));
                resolve(result);
            });

            toStream(file.buffer).pipe(upload);
        });
        console.log(result);

        return result.secure_url;
    }

}
