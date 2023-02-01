import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthService } from '../../auth.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' }) //config facebook/google/etc
  }

  async validate(email: string, password: string) {
    const user = await this.authService.validateUser(email, password)
    if (!user) throw new UnauthorizedException()

    return user
  }
}
