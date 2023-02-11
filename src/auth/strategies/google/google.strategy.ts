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

  async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) {
    const userInfo = {
      username: profile.displayName,
      email: profile.emails[0].value,
      password: null,
      authType: 'google',
      photo: profile.photos[0].value
    }

    const userExist = await this.userService.getOneByEmail(userInfo.email)
    if (userExist) {
      console.log('already exist')
      return userExist
    }

    const createdUser = await this.userService.createOne(userInfo)
    console.log('was created')
    done(null, createdUser)
  }
}
