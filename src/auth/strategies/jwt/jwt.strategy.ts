import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { AuthService } from '../../auth.service'
import { Request } from 'express'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService, private readonly configService: ConfigService) {
    super({
      /*  це поле для cookie або з Headers "Authorization" */
      jwtFromRequest: ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeaderAsBearerToken(), JwtStrategy.extractJwtFromCookie]),
      ignoreExpiration: false,
      secretOrKey: configService.get('AT_SECRET')
    })
  }

  private static extractJwtFromCookie(req: Request) {
    /* ця функція достає токен з cookie */
    if (req.cookies && 'ACCESS_TOKEN' in req.cookies) {
      return req.cookies['ACCESS_TOKEN']
    }
    return null
  }

  async validate(payload) {
    console.log(payload, '<<< VALIDATE PAYLOAD')

    /* це передається в req.user */
    return { ...payload, iat: undefined, exp: undefined }
  }
}
