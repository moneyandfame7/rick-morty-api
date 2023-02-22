import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ExtractJwt, Strategy } from 'passport-jwt'
import type { Request } from 'express'
import { EnvironmentConfigService } from '@config/environment-config.service'

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
    /* ця функція достає токен з cookie */
    // TODO: це не потрібно, бо я буду пхати кожен раз access token в запити
    if (req.cookies && 'ACCESS_TOKEN' in req.cookies) {
      return req.cookies.ACCESS_TOKEN
    }
    return null
  }

  public validate(payload: any): any {
    /* це передається в req.user */
    console.log(payload, '<<<<< JWT PAYLOAD')
    return payload
  }
}
