import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from './roles.decorator'
import { TokenService } from '../token/token.service'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private tokenService: TokenService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [context.getHandler(), context.getClass()])
      if (!requiredRoles) {
        return true
      }
      const req = context.switchToHttp().getRequest()
      const authHeader = req.headers.authorization
      const bearer = authHeader.split(' ')[0]
      const token = authHeader.split(' ')[1]

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException()
      }
      const user = await this.tokenService.validateAccessToken(token)
      req.user = user
      return requiredRoles.includes(user.role.value)
    } catch (e) {
      console.log(e)
      throw new HttpException('No access', HttpStatus.FORBIDDEN)
    }
  }
}
