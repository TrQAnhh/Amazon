import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IdentityEntity } from '../entity/identity.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from '@app/common/dto/identity/sign-in.dto';
import { AuthResponseDto } from '@app/common/dto/identity/auth-response.dto';
import { SignUpDto } from '@app/common/dto/identity/sign-up.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ErrorCode } from '@app/common/constants/error-code';
import {SERVICE_NAMES} from "@app/common/constants/service-names";
import {firstValueFrom} from "rxjs";

@Injectable()
export class IdentityService {
  constructor(
    @InjectRepository(IdentityEntity) private readonly identityRepo: Repository<IdentityEntity>,
    @Inject(SERVICE_NAMES.PROFILE) private readonly profileClient: ClientProxy,
    private readonly jwtService: JwtService,
  ) {}

  async findUserByEmail(email: string): Promise<IdentityEntity | null> {
    return this.identityRepo.findOne({
      where: { email },
    });
  }

  async signIn(signInDto: SignInDto): Promise<AuthResponseDto> {
    const user = await this.findUserByEmail(signInDto.email);

    if (!user) {
      throw new RpcException(ErrorCode.USER_NOT_FOUND);
    }

    const success = await bcrypt.compare(signInDto.password, user.password);
    if (!success) {
      throw new RpcException(ErrorCode.INVALID_CREDENTIALS);
    }

    const payload = this.createJwtPayload(user);
    const { accessToken, refreshToken } = this.generateToken(payload);

    return {
      message: 'Login successfully!',
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async signUp(signUpDto: SignUpDto): Promise<AuthResponseDto> {
    const existingUser = await this.findUserByEmail(signUpDto.email);

    if (existingUser) {
      throw new RpcException(ErrorCode.EMAIL_EXISTED);
    }

    const hashedPassword = await bcrypt.hash(signUpDto.password, Number(process.env.BCRYPT_SALT_ROUNDS) || 10);

    const user = this.identityRepo.create({
      ...signUpDto,
      password: hashedPassword,
    });

    const savedUser = await this.identityRepo.save(user);

    const userProfile = await firstValueFrom(this.profileClient.send({ cmd: 'create_profile'},{ userId: savedUser.id, signUpDto }));

    const payload = this.createJwtPayload(savedUser);
    const { accessToken, refreshToken } = this.generateToken(payload);

    return {
      message: 'Register successfully!',
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  private createJwtPayload(user: IdentityEntity) {
    return {
      sub: user.id,
      role: user.role,
    };
  }

  private generateToken(payload: any) {
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_REFRESH_TOKEN_DURATION,
    });
    return { accessToken, refreshToken };
  }
}
