import { PassportStrategy } from '@nestjs/passport'
import { Profile, Strategy, VerifyCallback } from 'passport-spotify'
import { ConfigService } from '@nestjs/config'
import { Injectable } from '@nestjs/common'
import { UserService } from '../../services/common/user.service'

@Injectable()
export class SpotifyStrategy extends PassportStrategy(Strategy, 'spotify') {
  constructor(private readonly configService: ConfigService, private readonly userService: UserService) {
    super({
      clientID: configService.get<string>('SPOTIFY_CLIENT_ID'),
      clientSecret: configService.get<string>('SPOTIFY_CLIENT_SECRET'),
      callbackURL: configService.get<string>('SPOTIFY_CALLBACK_URL'),

      scope: ['user-read-email', 'user-read-private', 'ugc-image-upload']
    })
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) {
    const userInfo = {
      username: profile.displayName,
      email: profile.emails[0].value,
      password: null,
      auth_type: profile.provider,
      photo: (profile.photos[0] as any).value,
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
