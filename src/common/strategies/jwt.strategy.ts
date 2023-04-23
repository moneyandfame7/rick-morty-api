import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ExtractJwt, Strategy } from 'passport-jwt'
import type { Request } from 'express'

import { EnvironmentConfigService, TokenService } from '@app/services/common'

import type { JwtPayload } from '@core/models/authorization'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  public constructor(private readonly config: EnvironmentConfigService, private readonly tokenService: TokenService) {
    super({
      /*  це поле для cookie або з Headers "Authorization" */
      jwtFromRequest: ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeaderAsBearerToken(), JwtStrategy.extractJwtFromCookie]),
      ignoreExpiration: false,
      secretOrKey: config.getJwtAccessSecret()
    })
  }

  private static extractJwtFromCookie(req: Request): string | null {
    /* ця функція дістає токен з cookie */
    if (req.cookies && 'ACCESS_TOKEN' in req.cookies) {
      return req.cookies.ACCESS_TOKEN
    }
    return null
  }

  public async validate(payload: JwtPayload): Promise<JwtPayload> {
    const refreshToken = await this.tokenService.getOneByUserId(payload.id)
    if (!refreshToken) {
      throw new UnauthorizedException()
    }
    return payload
  }
}
