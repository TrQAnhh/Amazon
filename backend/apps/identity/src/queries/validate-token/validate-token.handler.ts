import { ValidateTokenQuery } from './validate-token.query';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { ErrorCode, RedisHelper } from '@app/common';

@QueryHandler(ValidateTokenQuery)
export class ValidateTokenHandler implements IQueryHandler<ValidateTokenQuery> {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisHelper: RedisHelper,
  ) {}

  async execute(query: ValidateTokenQuery): Promise<any> {
    try {
      const decoded = this.jwtService.verify(query.token);

      if (!decoded) {
        throw new RpcException(ErrorCode.INVALID_JWT_TOKEN);
      }

      const redisKey = `access:${decoded.sub}`;
      const isBlacklisted = await this.redisHelper.get(redisKey);
      if (isBlacklisted) {
        return { valid: false, userId: null, role: null };
      }

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
