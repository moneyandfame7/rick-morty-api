import { Injectable, UnauthorizedException } from '@nestjs/common'
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

  public validate(accessToken: string, refreshToken: string, profile: Profile): UserBeforeAuthentication {
    if (!profile.emails) {
      throw new UnauthorizedException('An error has occurred. Try another authorization method.')
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
