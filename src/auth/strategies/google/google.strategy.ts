import { PassportStrategy } from '@nestjs/passport'
import { Profile, Strategy } from 'passport-google-oauth20'
import { ConfigService } from '@nestjs/config'
import { Injectable } from '@nestjs/common'
import { UserService } from '../../../user/user.service'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService, private readonly userService: UserService) {
    super({
      clientID: configService.get<string>('CLIENT_ID'),
      clientSecret: configService.get<string>('CLIENT_SECRET'),
      callbackURL: 'http://localhost:3000/auth/google/redirect',
      scope: ['profile', 'email']
    })
  }

  authorizationParams(): { [key: string]: string } {
    return {
      access_type: 'offline'
    }
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    console.log(accessToken)
    console.log('________________________________')
    console.log(refreshToken)
    console.log('________________________________')
    console.log(profile)

    // const exist = await this.userService.emailExists(profile.emails[0].value)
    // console.log(exist)

    const userInfo = {
      username: profile.displayName,
      email: profile.emails[0].value,
      password: profile.id
    }
    const createdUser = await this.userService.createOne(userInfo)
    console.log(' <<< CREATED USER GOOGLE', createdUser)

    return createdUser || null
  }
}
