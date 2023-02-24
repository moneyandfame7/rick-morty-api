import { BadRequestException, Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Profile, Strategy } from 'passport-discord'

import { UserBeforeAuthentication } from '@core/models'

import { EnvironmentConfigService } from '@app/services/common/environment-config.service'

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

  public validate(accessToken: string, refreshToken: string, profile: Profile): UserBeforeAuthentication {
    if (!profile.email) {
      throw new BadRequestException('An error has occurred. Try another authorization method.')
    }
    return {
      email: profile.email,
      username: profile.username,
      auth_type: profile.provider,
      /* https://stackoverflow.com/questions/65450055/how-to-get-avatar-from-discord-api */
      photo: `${this.DISCORD_AVATARS_URL}/${profile.id}/${profile.avatar}`,
      is_verified: true
    }
  }
}
