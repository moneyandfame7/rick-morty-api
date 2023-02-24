import { PassportStrategy } from '@nestjs/passport'
import { ConfigService } from '@nestjs/config'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { type Profile, Strategy, type VerifyCallback } from 'passport-spotify'
import { UserBeforeAuthentication } from '@domain/models/common/user.model'

@Injectable()
export class SpotifyStrategy extends PassportStrategy(Strategy, 'spotify') {
  public constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>('SPOTIFY_CLIENT_ID'),
      clientSecret: configService.get<string>('SPOTIFY_CLIENT_SECRET'),
      callbackURL: configService.get<string>('SPOTIFY_CALLBACK_URL'),

      scope: ['user-read-email', 'user-read-private', 'ugc-image-upload']
    })
  }

  public async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback): Promise<void> {
    if (!profile.emails) {
      throw new UnauthorizedException('An error has occurred. Try another authorization method.')
    }
    const userInfo: UserBeforeAuthentication = {
      username: profile.displayName,
      email: profile.emails?.[0].value,
      auth_type: profile.provider,
      photo: profile.photos ? (profile.photos[0] as any).value : undefined, // eslint-disable-line
      is_verified: true
    }

    done(null, userInfo)
  }
}
