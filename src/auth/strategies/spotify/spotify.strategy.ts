import { PassportStrategy } from '@nestjs/passport'
import { Profile, Strategy, VerifyCallback } from 'passport-spotify'
import { ConfigService } from '@nestjs/config'
import { BadRequestException, Injectable } from '@nestjs/common'
import { UserService } from '../../../user/user.service'

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
      username: profile.username,
      email: profile.emails[0].value,
      password: null,
      authType: profile.provider,
      photo: (profile.photos[0] as any).value
    }
    console.log(userInfo)

    const userWithSameUserName = await this.userService.getOneByUsername(userInfo.username)
    if (userWithSameUserName) throw new BadRequestException(`User ${userInfo.username} already exists`)

    const userWithSameAuthType = await this.userService.getOneByAuthType(userInfo.email, userInfo.authType)

    if (userWithSameAuthType) return userWithSameAuthType

    const createdUser = await this.userService.createOne(userInfo)
    done(null, createdUser)
  }
}
