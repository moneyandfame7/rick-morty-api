import { BadRequestException, Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { type Profile, Strategy } from 'passport-github2'
import { EnvironmentConfigService } from '@config/environment-config.service'
import { UserBeforeAuthentication } from '@domain/models/common/user.model'

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  public constructor(private readonly config: EnvironmentConfigService) {
    super({
      clientID: config.getGithubClientId(),
      clientSecret: config.getGithubClientSecret(),
      callbackURL: config.getGithubCallbackUrl(),
      scope: ['public_profile', 'user:email']
    })
  }

  public async validate(accessToken: string, refreshToken: string, profile: Profile) {
    if (!profile.emails) {
      throw new BadRequestException('Email is required')
    }
    const userInfo: UserBeforeAuthentication = {
      username: profile.username || profile.displayName,
      email: profile.emails[0].value,
      password: null,
      auth_type: profile.provider,
      photo: profile.photos ? (profile.photos[0] as any).value : null,
      is_verified: true
    }

    return userInfo
  }
}
