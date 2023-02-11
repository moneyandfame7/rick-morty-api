import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Request } from 'express'
import { TokenService } from '../token/token.service'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest()
    const authHeader = request.headers.authorization

    if (request.isAuthenticated()) return true

    if (authHeader) {
      const token = authHeader.split(' ')[1]

      const user = await this.tokenService.validateAccessToken(token)
      if (!user) throw new UnauthorizedException('Invalid access token.')

      return true
    }

    throw new UnauthorizedException()
  }
}
