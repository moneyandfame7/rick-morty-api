import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UserService } from '../../../user/user.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService, private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('AT_SECRET')
    })
  }

  // TODO зробити рефреш, перевірити в відосі як це працює і мб мідлвеер якщоце потрібно
  // погуглити про extract jwt, cookie, refresh token
  async validate(payload: { id: string; email: string }) {
    return { id: payload.id, email: payload.email }
  }
}
