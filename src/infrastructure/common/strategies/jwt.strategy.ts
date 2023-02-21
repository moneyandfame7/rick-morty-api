import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { AuthService } from '@services/auth/auth.service'
import type { Request } from 'express'
import { EnvironmentConfigService } from '@config/environment-config.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly config: EnvironmentConfigService, private readonly authService: AuthService) {
    super({
      /*  це поле для cookie або з Headers "Authorization" */
      jwtFromRequest: ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeaderAsBearerToken(), JwtStrategy.extractJwtFromCookie]),
      ignoreExpiration: false,
      secretOrKey: config.getJwtAccessSecret()
    })
  }

  private static extractJwtFromCookie(req: Request): string | null {
    /* ця функція достає токен з cookie */
    // TODO: зробити тут мб перевірку якщо вже є в куках рефреш токен то просто оновити токен і все?ч
    if (req.cookies && 'ACCESS_TOKEN' in req.cookies) {
      return req.cookies.ACCESS_TOKEN
    }
    return null
  }

  private validate(payload: any): any {
    /* це передається в req.user */
    console.log(payload, '<<<<< PAYLOAD')
    return payload
  }
}
