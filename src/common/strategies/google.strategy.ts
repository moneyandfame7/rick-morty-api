import { PassportStrategy } from '@nestjs/passport'
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20'
import { BadRequestException, Injectable } from '@nestjs/common'

import { UserBeforeAuthentication } from '@core/models'

import { EnvironmentConfigService } from '@app/services/common/environment-config.service'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  public constructor(private readonly config: EnvironmentConfigService) {
    super({
      clientID: config.getGoogleClientId(),
      clientSecret: config.getGoogleClientSecret(),
      callbackURL: config.getGoogleCallbackUrl(),
      scope: ['profile', 'email']
    })
  }

  public async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback): Promise<void> {
    if (!profile.emails) {
      throw new BadRequestException('An error has occurred. Try another authorization method.')
    }
    const userInfo: UserBeforeAuthentication = {
      email: profile.emails[0].value,
      username: profile.displayName,
      auth_type: profile.provider,
      photo: profile.photos ? (profile.photos[0] as any).value : undefined, // eslint-disable-line
      is_verified: true
    }

    done(null, userInfo)
  }
}
