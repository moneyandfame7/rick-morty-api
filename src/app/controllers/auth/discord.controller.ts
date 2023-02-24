import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common'
import type { Request, Response } from 'express'

import { AuthService } from '@app/services/auth/auth.service'
import { UserService } from '@app/services/common/user.service'
import { TokenService } from '@app/services/common/token.service'

import type { AuthTokens, UserBeforeAuthentication } from '@core/models'
import { BaseController } from '@core/controllers/auth/base-controller'

import { DiscordAuthGuard } from '@common/guards/auth/discord.guard'

import { EnvironmentConfigService } from '@app/services/common/environment-config.service'

@Controller('/auth/discord')
export class DiscordController extends BaseController {
  public constructor(
    protected readonly config: EnvironmentConfigService,
    protected authService: AuthService,
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
  public async redirect(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<AuthTokens> {
    const user = req.user as UserBeforeAuthentication
    const tokens = await this.socialLogin(user)
    this.setCookies(res, tokens.refresh_token, tokens.access_token)
    return tokens
  }
}
