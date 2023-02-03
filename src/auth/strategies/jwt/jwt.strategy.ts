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

  async validate(payload: any) {
    const user = await this.userService.getOneByEmail(payload.email)
    return {
      id: user.id,
      email: user.email,
      role: {
        id: user.role.id,
        value: user.role.value
      }
    }
  }
}
