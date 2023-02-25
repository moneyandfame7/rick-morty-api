import { Controller, Get, Res, UseGuards } from '@nestjs/common'
import type { Response } from 'express'

import { AuthorizationService } from '@app/services/authorization'
import { EnvironmentConfigService, TokenService, UserService } from '@app/services/common'

import type { UserBeforeAuthentication } from '@core/models/common'
import type { AuthorizationTokens } from '@core/models/authorization'
import { BaseAuthorizationController } from '@core/controllers/authorization'

import { GetUser } from '@common/decorators'
import { DiscordAuthGuard } from '@common/guards/authorization'
import { ApiTags } from '@nestjs/swagger'

@Controller('/auth/discord')
@ApiTags('discord auth')
export class DiscordController extends BaseAuthorizationController {
  public constructor(
    protected readonly config: EnvironmentConfigService,
    protected authService: AuthorizationService,
    protected userService: UserService,
    protected tokenService: TokenService
  ) {
    super(config, authService, userService, tokenService)
  }

  @Get('/login')
  @UseGuards(DiscordAuthGuard)
  public async login(): Promise<void> {}

  @Get('/redirect')
  @UseGuards(DiscordAuthGuard)
  public async redirect(@GetUser() user: UserBeforeAuthentication, @Res({ passthrough: true }) res: Response): Promise<AuthorizationTokens> {
    const tokens = await this.socialLogin(user)
    this.setCookies(res, tokens.refresh_token, tokens.access_token)
    return tokens
  }
}
