import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Profile, Strategy } from 'passport-github2'
import { UserService } from '../../services/common/user.service'
import { EnvironmentConfigService } from '../../config/environment-config.service'

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private readonly config: EnvironmentConfigService, private readonly userService: UserService) {
    super({
      clientID: config.getGithubClientId(),
      clientSecret: config.getGithubClientSecret(),
      callbackURL: config.getGithubCallbackUrl(),
      scope: ['public_profile', 'user:email']
    })
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const userInfo = {
      username: profile.username,
      email: profile.emails[0].value,
      password: null,
      authType: profile.provider,
      photo: profile.photos[0].value
    }

    const userWithSameAuthType = await this.userService.getOneByAuthType(userInfo.email, userInfo.authType)
    if (userWithSameAuthType) return userWithSameAuthType

    const userWithSameUserName = await this.userService.getOneByUsername(userInfo.username)
    if (userWithSameUserName) {
      userInfo.username = '$N33d t0 Ch@ng3'
      return await this.userService.createOne(userInfo)
    }

    return await this.userService.createOne(userInfo)
  }
}
