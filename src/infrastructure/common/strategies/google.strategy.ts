import { PassportStrategy } from '@nestjs/passport'
import { type Profile, Strategy, type VerifyCallback } from 'passport-google-oauth20'
import { BadRequestException, Injectable } from '@nestjs/common'
import { UserService } from '@services/common/user.service'
import { EnvironmentConfigService } from '@config/environment-config.service'
import { CreateUserDto } from '@dto/common/user.dto'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly config: EnvironmentConfigService, private readonly userService: UserService) {
    super({
      clientID: config.getGoogleClientId(),
      clientSecret: config.getGoogleClientSecret(),
      callbackURL: config.getGoogleCallbackUrl(),
      scope: ['profile', 'email']
    })
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback): Promise<void> {
    if (!profile.emails) {
      throw new BadRequestException('Email is required')
    }
    console.log(profile)
    const userInfo: CreateUserDto = {
      username: profile.displayName,
      email: profile.emails[0].value,
      auth_type: profile.provider,
      photo: profile.photos ? (profile.photos[0] as any).value : null,
      is_verified: true
    }

    // const userWithSameAuthType = await this.userService.getOneByAuthType(userInfo.email, userInfo.auth_type)
    // if (userWithSameAuthType) {
    //   done(null, userWithSameAuthType)
    // }
    //
    // const userWithSameUserName = await this.userService.getOneByUsername(userInfo.username)
    // if (userWithSameUserName) {
    //   userInfo.username = '$N33d t0 Ch@ng3'
    //   const createdUser = await this.userService.createOne(userInfo)
    //   done(null, createdUser)
    // }
    //
    // const createdUser = await this.userService.createOne(userInfo)
    done(null, userInfo)
  }
}
