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

      if (!decoded || !decoded.tokenId || !decoded.sub) {
        throw new RpcException(ErrorCode.INVALID_JWT_TOKEN);
      }

      const validatedKey = `validated:${decoded.tokenId}`;
      const cached = await this.redisHelper.get(validatedKey);

      if (cached) {
        return {
          valid: true,
          userId: decoded.sub,
          role: decoded.role,
        };
      }

      const blacklistKey = `access:${decoded.sub}`;
      const isBlacklisted = await this.redisHelper.get(blacklistKey);

      if (isBlacklisted) {
        return { valid: false, userId: null, role: null };
      }

      const verified = await this.jwtService.verify(query.token);

      const ttl = verified.exp - Math.floor(Date.now() / 1000);
      await this.redisHelper.set(validatedKey, '1', ttl);

      return {
        valid: true,
        userId: decoded.sub,
        role: decoded.role,
      };
    } catch (error) {
      console.error(`[JWT ERROR] `, error);
      return {
        valid: false,
        userId: null,
        role: null,
      };
    }
  }
}
