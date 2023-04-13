import { Controller, Get, Redirect, Res, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import type { Response } from 'express'

import { AuthorizationService } from '@app/services/authorization'
import { EnvironmentConfigService, TokenService, UserService } from '@app/services/common'

import { BaseAuthorizationController } from '@core/controllers/authorization'
import type { UserBeforeAuthentication } from '@core/models/common'
import type { RedirectType } from '@core/models/authorization'

import { GetUser } from '@common/decorators'
import { DiscordAuthGuard } from '@common/guards/authorization'

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
  @Redirect()
  @UseGuards(DiscordAuthGuard)
  public async redirect(@GetUser() user: UserBeforeAuthentication): Promise<RedirectType> {
    const data = await this.socialLogin(user)
    return {
      url: `${this.SUCCESS_CLIENT_REDIRECT}?refresh=${data.refresh_token}&access=${data.access_token}`
    }
  }
}
