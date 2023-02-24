import { type CanActivate, type ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from '../decorators/roles.decorator'
import { TokenService } from '@services/common/token.service'
import type { Request } from 'express'

@Injectable()
export class RolesGuard implements CanActivate {
  public constructor(private readonly tokenService: TokenService, private readonly reflector: Reflector) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [context.getHandler(), context.getClass()])
      if (!requiredRoles) {
        return true
      }
      const req: Request = context.switchToHttp().getRequest()
      const authHeader = req.headers.authorization
      const authCookie = req.cookies.ACCESS_TOKEN

      if (authHeader) {
        const bearer = authHeader.split(' ')[0]
        const token = authHeader.split(' ')[1]
        if (bearer !== 'Bearer' || !token) {
          throw new UnauthorizedException()
        }
        const user = this.tokenService.validateAccessToken(token)
        req.user = user
        return requiredRoles.includes(user.role.value)
      }
      if (authCookie) {
        const user = this.tokenService.validateAccessToken(authCookie)
        req.user = user
        return requiredRoles.includes(user.role.value)
      }
      throw new UnauthorizedException()
    } catch (e) {
      throw new UnauthorizedException(e)
    }
  }
}
