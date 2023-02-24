import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ExtractJwt, Strategy } from 'passport-jwt'
import type { Request } from 'express'
import { EnvironmentConfigService } from '@config/environment-config.service'
import { JwtPayload } from '@domain/models/auth/auth.model'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  public constructor(private readonly config: EnvironmentConfigService) {
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

  public validate(payload: JwtPayload): JwtPayload {
    return payload
  }
}
