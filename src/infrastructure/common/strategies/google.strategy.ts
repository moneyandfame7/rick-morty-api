import { PassportStrategy } from '@nestjs/passport'
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20'
import { Injectable } from '@nestjs/common'
import { UserService } from '../../services/common/user.service'
import { EnvironmentConfigService } from '../../config/environment-config.service'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly config: EnvironmentConfigService, private readonly userService: UserService) {
    super({
      clientID: config.getGoogleClientId(),
      clientSecret: config.getGoogleClientSecret(),
      callbackURL: config.getGoogleCallbackUrl(),
      scope: ['profile', 'email']
    })
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) {
    console.log(profile)

    const userInfo = {
      username: profile.displayName,
      email: profile.emails[0].value,
      password: null,
      authType: profile.provider,
      photo: profile.photos[0].value
    }

    const userWithSameAuthType = await this.userService.getOneByAuthType(userInfo.email, userInfo.authType)

    if (userWithSameAuthType) return userWithSameAuthType

    const createdUser = await this.userService.createOne(userInfo)
    done(null, createdUser)
  }
}
