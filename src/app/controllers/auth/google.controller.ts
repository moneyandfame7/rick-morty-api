import { Controller, Get, Res, UseGuards } from '@nestjs/common'
import type { Response } from 'express'

import { UserService } from '@app/services/common/user.service'
import { TokenService } from '@app/services/common/token.service'
import { AuthService } from '@app/services/auth/auth.service'
import { EnvironmentConfigService } from '@app/services/common/environment-config.service'

import { BaseController } from '@core/controllers/auth/base-controller'
import type { AuthTokens, UserBeforeAuthentication } from '@core/models'

import { GoogleAuthGuard } from '@common/guards/auth/google.guard'
import { GetUser } from '@common/decorators/user.decorator'

@Controller('/auth/google')
export class GoogleController extends BaseController {
  public constructor(
    protected readonly config: EnvironmentConfigService,
    protected readonly authService: AuthService,
    protected readonly userService: UserService,
    protected readonly tokenService: TokenService
  ) {
    super(config, authService, userService, tokenService)
  }

  @Get('/login')
  @UseGuards(GoogleAuthGuard)
  public async login(): Promise<void> {}

  @Get('/redirect')
  @UseGuards(GoogleAuthGuard)
  public async redirect(@GetUser() user: UserBeforeAuthentication, @Res({ passthrough: true }) res: Response): Promise<AuthTokens> {
    const tokens = await this.socialLogin(user)
    this.setCookies(res, tokens.refresh_token, tokens.access_token)
    return tokens
  }
}
