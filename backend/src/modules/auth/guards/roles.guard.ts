import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "@prisma/client";
import { Observable } from "rxjs";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRoles = this.reflector.get<Role[]>(process.env.ROLES_KEY, context.getHandler());

        if (!requiredRoles) {            // checks if there is a role indicated in the route handler
            return true;
        }

        const request = context.switchToHttp().getRequest();         // gets the request
        const user = request.user                                    // gets the user from the request aka http header

        if (!requiredRoles.includes(user.role)) {
            throw new ForbiddenException(`You do not have permission to do this action.`)         // checks if the user in request is authorized or have a correct role
        }

        return true;                    // grants the user to access the handler
    }
}