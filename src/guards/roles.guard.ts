import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const roles =
            this.reflector.get<string[]>('roles', context.getHandler()) ||
            this.reflector.get<string[]>('roles', context.getClass());
        console.log(roles);
        if (!roles || roles.includes('GUEST')) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.session.user;
        return user && user.role && roles.includes(user.role);
    }
}
