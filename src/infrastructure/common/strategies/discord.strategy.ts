import { BadRequestException, Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { type Profile, Strategy } from 'passport-discord'
import { UserService } from '@services/common/user.service'
import { EnvironmentConfigService } from '@config/environment-config.service'

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  private readonly DISCORD_AVATARS_URL = 'https://cdn.discordapp.com/avatars'

  constructor(private readonly config: EnvironmentConfigService, private readonly userService: UserService) {
    super({
      clientID: config.getDiscordClientId(),
      clientSecret: config.getDiscordClientSecret(),
      callbackURL: config.getDiscordCallbackUrl(),
      scope: ['identify', 'email']
    })
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    if (!profile.email) {
      throw new BadRequestException('Error is required')
    }
    const userInfo = {
      username: profile.username,
      email: profile.email,
      auth_type: profile.provider,
      /* https://stackoverflow.com/questions/65450055/how-to-get-avatar-from-discord-api */
      photo: `${this.DISCORD_AVATARS_URL}/${profile.id}/${profile.avatar}`,
      is_verified: true
    }

    /* const userWithSameAuthType = await this.userService.getOneByAuthType(userInfo.email, userInfo.auth_type)
    if (userWithSameAuthType) {
      return userWithSameAuthType
    }

    const userWithSameUserName = await this.userService.getOneByUsername(userInfo.username)
    if (userWithSameUserName) {
      userInfo.username = '$N33d t0 Ch@ng3'
      return this.userService.createOne(userInfo)
    }

    return this.userService.createOne(userInfo)*/

    return userInfo
  }
}
