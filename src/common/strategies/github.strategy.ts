import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Profile, Strategy } from 'passport-github2'

import { EnvironmentConfigService } from '@app/services/common'

import { UserBeforeAuthentication } from '@core/models/common'

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  public constructor(private readonly config: EnvironmentConfigService) {
    super({
      clientID: config.getGithubClientId(),
      clientSecret: config.getGithubClientSecret(),
      callbackURL: config.getBaseUrl() + "/auth/github/redirect",
      scope: ['public_profile', 'user:email']
    })
  }

  public validate(accessToken: string, refreshToken: string, profile: Profile): UserBeforeAuthentication {
    if (!profile.emails) {
      throw new InternalServerErrorException('An error has occurred. Try another authorization method.')
    }
    return {
      username: profile.username || profile.displayName,
      email: profile.emails[0].value,
      auth_type: profile.provider,
      photo: profile.photos ? (profile.photos[0] as any).value : undefined, // eslint-disable-line
      is_verified: true
    }
  }
}
