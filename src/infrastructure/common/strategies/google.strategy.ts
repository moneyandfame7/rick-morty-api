import { PassportStrategy } from '@nestjs/passport'
import { type Profile, Strategy, type VerifyCallback } from 'passport-google-oauth20'
import { BadRequestException, Injectable } from '@nestjs/common'
import { EnvironmentConfigService } from '@config/environment-config.service'
import { UserBeforeAuthentication } from '@domain/models/common/user.model'

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
      throw new BadRequestException('Email is required')
    }
    const userInfo: UserBeforeAuthentication = {
      email: profile.emails[0].value,
      username: profile.displayName,
      password: null,
      auth_type: profile.provider,
      photo: profile.photos ? (profile.photos[0] as any).value : null,
      is_verified: true
    }

    done(null, userInfo)
  }
}
