import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { IS_PUBLIC_KEY } from '../common/decorators/public.decorator';

@Injectable()
export class AppGuard implements CanActivate {
  constructor(
    private jwtAuthGuard: JwtAuthGuard,
    private rolesGuard: RolesGuard,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const auth = await this.jwtAuthGuard.canActivate(context);
    if (!auth) return false;

    const role = await this.rolesGuard.canActivate(context);
    return role;
  }
}
