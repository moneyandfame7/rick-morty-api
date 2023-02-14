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
      auth_type: profile.provider,
      photo: profile.photos[0].value,
      is_verified: true
    }

    const userWithSameAuthType = await this.userService.getOneByAuthType(userInfo.email, userInfo.auth_type)
    if (userWithSameAuthType) return userWithSameAuthType

    const userWithSameUserName = await this.userService.getOneByUsername(userInfo.username)
    if (userWithSameUserName) {
      userInfo.username = '$N33d t0 Ch@ng3'
      const createdUser = await this.userService.createOne(userInfo)
      done(null, createdUser)
    }

    const createdUser = await this.userService.createOne(userInfo)
    done(null, createdUser)
  }
}
