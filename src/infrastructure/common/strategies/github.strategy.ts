import { BadRequestException, Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { type Profile, Strategy } from 'passport-github2'
import { UserService } from '@services/common/user.service'
import { EnvironmentConfigService } from '@config/environment-config.service'

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
    if (!profile.emails) {
      throw new BadRequestException('Email is required')
    }
    const userInfo = {
      username: profile.username || profile.displayName,
      email: profile.emails[0].value,
      auth_type: profile.provider,
      photo: profile.photos ? (profile.photos[0] as any).value : null,
      is_verified: true
    }

    /*    const userWithSameAuthType = await this.userService.getOneByAuthType(userInfo.email, userInfo.auth_type)
    if (userWithSameAuthType) {
      return userWithSameAuthType
    }

    const userWithSameUserName = await this.userService.getOneByUsername(userInfo.username)
    if (userWithSameUserName) {
      userInfo.username = '$N33d t0 Ch@ng3'
      return this.userService.createOne(userInfo)
    }

    return this.userService.createOne(userInfo)*/
    return userInfo
  }
}
