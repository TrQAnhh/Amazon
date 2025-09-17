import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IdentityEntity } from '../entity/identity.entity';
import { In, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from '@app/common/dto/identity/request/sign-in.dto';
import { AuthResponseDto } from '@app/common/dto/identity/response/auth-response.dto';
import { SignUpDto } from '@app/common/dto/identity/request/sign-up.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ErrorCode } from '@app/common/constants/error-code';
import { SERVICE_NAMES } from '@app/common/constants/service-names';
import { firstValueFrom } from 'rxjs';
import { IdentityResponseDto } from '@app/common/dto/identity/response/identity-response.dto';

@Injectable()
export class IdentityService {
  constructor(
    @InjectRepository(IdentityEntity) private readonly identityRepo: Repository<IdentityEntity>,
    @Inject(SERVICE_NAMES.PROFILE) private readonly profileClient: ClientProxy,
    private readonly jwtService: JwtService,
  ) {}

  async findUserById(userId: number): Promise<IdentityEntity | null> {
    if (userId == null) {
      console.log(userId);
      throw new RpcException(ErrorCode.INVALID_INPUT_VALUE);
    }

    return this.identityRepo.findOne({
      where: {
        id: userId,
      },
    });
  }

  async findUserByEmail(email: string): Promise<IdentityEntity | null> {
    if (!email) throw new RpcException(ErrorCode.INVALID_INPUT_VALUE);

    return this.identityRepo.findOne({
      where: { email },
    });
  }

  async getUserIdentity(userId: number): Promise<IdentityResponseDto> {
    const userById = await this.findUserById(userId);

    if (!userById) {
      throw new RpcException(ErrorCode.USER_NOT_FOUND);
    }

    const { email } = userById;
    return { email };
  }

  async getUsersIdentity(userIds: number[]): Promise<Record<number, IdentityResponseDto>> {
    if (!userIds || userIds.length === 0) {
      throw new RpcException(ErrorCode.INVALID_INPUT_VALUE);
    }

    const users = await this.identityRepo.find({
      where: { id: In(userIds) },
    });

    const result: Record<number, IdentityResponseDto> = {};
    users.forEach((user) => (result[user.id] = { email: user.email }));

    return result;
  }

  async signIn(signInDto: SignInDto): Promise<AuthResponseDto> {
    const userByEmail = await this.findUserByEmail(signInDto.email);

    if (!userByEmail) {
      throw new RpcException(ErrorCode.USER_NOT_FOUND);
    }

    const success = await bcrypt.compare(signInDto.password, userByEmail.password);
    if (!success) {
      throw new RpcException(ErrorCode.INVALID_CREDENTIALS);
    }

    const payload = this.createJwtPayload(userByEmail);
    const { accessToken, refreshToken } = this.generateToken(payload);

    return {
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

    await firstValueFrom(this.profileClient.send({ cmd: 'create_profile' }, { userId: savedUser.id, signUpDto }));

    const payload = this.createJwtPayload(savedUser);
    const { accessToken, refreshToken } = this.generateToken(payload);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async validateToken(token: string): Promise<any> {
    try {
      const decoded = this.jwtService.verify(token);

      if (!decoded) {
        throw new RpcException(ErrorCode.INVALID_JWT_TOKEN);
      }

      return {
        valid: true,
        userId: decoded.sub,
        role: decoded.role,
      };
    } catch (error) {
      console.log(error);
      return {
        valid: false,
        userId: null,
        role: null,
      };
    }
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
