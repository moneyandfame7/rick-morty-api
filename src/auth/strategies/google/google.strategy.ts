import { PassportStrategy } from '@nestjs/passport'
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20'
import { ConfigService } from '@nestjs/config'
import { Injectable } from '@nestjs/common'
import { UserService } from '../../../user/user.service'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService, private readonly userService: UserService) {
    super({
      clientID: configService.get<string>('CLIENT_ID'),
      clientSecret: configService.get<string>('CLIENT_SECRET'),
      callbackURL: 'http://localhost:3000/auth/google/redirect',
      scope: ['profile', 'email']
    })
  }

  authorizationParams(): { [key: string]: string } {
    return {
      access_type: 'offline'
    }
  }
  async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) {
    // const exist = await this.userService.emailExists(profile.emails[0].value)
    // console.log(exist)
    const userInfo = {
      username: profile.displayName,
      email: profile.emails[0].value,
      password: null,
      authType: 'google',
      photo: profile.photos[0].value
    }
    // TODO: спитати про пароль, шо і як це робиться якщо він знає
    const userExist = await this.userService.getOneByEmail(userInfo.email)
    if (userExist) return userExist

    const createdUser = await this.userService.createOne(userInfo)

    done(null, createdUser)
  }
}
