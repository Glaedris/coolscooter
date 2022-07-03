import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/config/jwtSettings';
import { ROLES_KEY } from 'src/utils/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.includes(Role.ALL)) {
      //no roles or 0 roles
      return true;
    }

    const whitelistRoles = requiredRoles.map((role) => Role[role]);

    const { user } = context.switchToHttp().getRequest();

    return whitelistRoles.includes(user.role);
  }
}
