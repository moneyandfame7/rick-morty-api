import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Profile, Strategy } from 'passport-github2'
import { UserService } from '../../../user/user.service'

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private readonly configService: ConfigService, private readonly userService: UserService) {
    super({
      clientID: configService.get<string>('GITHUB_CLIENT_ID'),
      clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET'),
      callbackURL: 'http://localhost:3000/auth/github/redirect',
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

    return await this.userService.createOne(userInfo)
  }
}
