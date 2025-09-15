import {
  Injectable,
  OnModuleInit,
  Inject,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { SERVICE_NAMES } from '../common/constants/service-names';
import { catchError, lastValueFrom, Observable, throwError } from 'rxjs';
import { SignUpDto } from '@app/common/dto/identity/sign-up.dto';
import { SignInDto } from '@app/common/dto/identity/sign-in.dto';
import { AuthResponseDto } from '@app/common/dto/identity/auth-response.dto';

@Injectable()
export class IdentityService implements OnModuleInit {
  constructor(@Inject(SERVICE_NAMES.IDENTITY) private client: ClientProxy) {}

  async onModuleInit() {
    await this.client.connect();
  }

  // signUp(dto: SignUpDto): Observable<AuthResponseDto> {
  //     return this.client.send<AuthResponseDto, SignUpDto>({ cmd: 'signUp' }, dto).pipe(
  //         catchError(err => throwError(() => new HttpException(err.message, HttpStatus.BAD_REQUEST)))
  //     );
  // }

  // async signUp(dto: SignUpDto): Promise<AuthResponseDto> {
  //     try {
  //         return await lastValueFrom(this.client.send<AuthResponseDto, SignUpDto>(
  //             { cmd: 'signUp' },
  //             dto
  //         ));
  //     } catch (err) {
  //         throw new RpcException(err);
  //     }
  // }

  signUp(dto: SignUpDto): Observable<AuthResponseDto> {
    return this.client.send<AuthResponseDto, SignUpDto>({ cmd: 'signUp' }, dto);
  }

  signIn(dto: SignInDto): Observable<AuthResponseDto> {
    return this.client.send({ cmd: 'signIn' }, dto);
  }
}
