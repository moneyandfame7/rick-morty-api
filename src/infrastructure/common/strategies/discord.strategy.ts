import { BadRequestException, Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { type Profile, Strategy } from 'passport-discord'
import { EnvironmentConfigService } from '@config/environment-config.service'
import { UserBeforeAuthentication } from '@domain/models/common/user.model'

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  private readonly DISCORD_AVATARS_URL = 'https://cdn.discordapp.com/avatars'

  public constructor(private readonly config: EnvironmentConfigService) {
    super({
      clientID: config.getDiscordClientId(),
      clientSecret: config.getDiscordClientSecret(),
      callbackURL: config.getDiscordCallbackUrl(),
      scope: ['identify', 'email']
    })
  }

  public async validate(accessToken: string, refreshToken: string, profile: Profile) {
    if (!profile.email) {
      throw new BadRequestException('Error is required')
    }
    const userInfo: UserBeforeAuthentication = {
      email: profile.email,
      username: profile.username,
      password: null,
      auth_type: profile.provider,
      /* https://stackoverflow.com/questions/65450055/how-to-get-avatar-from-discord-api */
      photo: `${this.DISCORD_AVATARS_URL}/${profile.id}/${profile.avatar}`,
      is_verified: true,
      verify_link: null
    }

    return userInfo
  }
}
