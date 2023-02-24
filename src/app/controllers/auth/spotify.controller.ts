import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common'
import type { Request, Response } from 'express'

import { AuthService } from '@app/services/auth/auth.service'
import { UserService } from '@app/services/common/user.service'
import { TokenService } from '@app/services/common/token.service'

import type { AuthTokens, UserBeforeAuthentication } from '@core/models'
import { BaseController } from '@core/controllers/auth/base-controller'

import { SpotifyAuthGuard } from '@common/guards/auth/spotify.guard'

import { EnvironmentConfigService } from '@app/services/common/environment-config.service'

@Controller('/auth/spotify')
export class SpotifyController extends BaseController {
  public constructor(
    protected readonly config: EnvironmentConfigService,
    protected readonly authService: AuthService,
    protected readonly userService: UserService,
    protected readonly tokenService: TokenService
  ) {
    super(config, authService, userService, tokenService)
  }

  @Get('/login')
  @UseGuards(SpotifyAuthGuard)
  public async login(): Promise<void> {}

  @Get('/redirect')
  @UseGuards(SpotifyAuthGuard)
  public async redirect(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<AuthTokens> {
    const user = req.user as UserBeforeAuthentication
    const tokens = await this.socialLogin(user)
    this.setCookies(res, tokens.refresh_token, tokens.access_token)
    return tokens
  }
}
