import { ValidateTokenQuery } from './validate-token.query';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { ErrorCode, RedisHelper } from '@app/common';
import now = jest.now;

@QueryHandler(ValidateTokenQuery)
export class ValidateTokenHandler implements IQueryHandler<ValidateTokenQuery> {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisHelper: RedisHelper,
  ) {}

  async execute(query: ValidateTokenQuery): Promise<any> {
    try {
      const decoded = this.jwtService.decode(query.token);

      if (!decoded) {
        throw new RpcException(ErrorCode.INVALID_JWT_TOKEN);
      }

      const validatedKey = `validated:${decoded.deviceId}`;
      const cached = await this.redisHelper.get(validatedKey);

      if (cached === decoded.tokenId) {
        return {
          valid: true,
          userId: decoded.sub,
          role: decoded.role,
          tokenId: decoded.tokenId,
          deviceId: decoded.deviceId,
        };
      }

      const blacklistKey = `access:${decoded.deviceId}`;
      const isBlacklisted = await this.redisHelper.sismember(blacklistKey, decoded.tokenId);

      if (isBlacklisted) {
        return {
          valid: false,
          userId: null,
          role: null,
          tokenId: null,
          deviceId: null,
        };
      }

      const verified = await this.jwtService.verify(query.token);

      const ttl = verified.exp - Math.floor(Date.now() / 1000);
      await this.redisHelper.set(validatedKey, verified.tokenId, ttl);

      return {
        valid: true,
        userId: verified.sub,
        role: verified.role,
        tokenId: verified.tokenId,
        deviceId: verified.deviceId,
      };
    } catch (error) {
      console.error(`[JWT ERROR] `, error);
      return {
        valid: false,
        userId: null,
        role: null,
        tokenId: null,
        deviceId: null,
      };
    }
  }
}
