import { Controller, Get, Res, UseGuards } from '@nestjs/common'
import type { Response } from 'express'

import { AuthService } from '@app/services/auth/auth.service'
import { UserService } from '@app/services/common/user.service'
import { TokenService } from '@app/services/common/token.service'
import { EnvironmentConfigService } from '@app/services/common/environment-config.service'

import { BaseController } from '@core/controllers/auth/base-controller'
import type { AuthTokens, UserBeforeAuthentication } from '@core/models'

import { GithubAuthGuard } from '@common/guards/auth/github.guard'
import { GetUser } from '@common/decorators/user.decorator'

@Controller('/auth/github')
export class GithubController extends BaseController {
  public constructor(
    protected readonly config: EnvironmentConfigService,
    protected readonly authService: AuthService,
    protected readonly userService: UserService,
    protected readonly tokenService: TokenService
  ) {
    super(config, authService, userService, tokenService)
  }

  @Get('/login')
  @UseGuards(GithubAuthGuard)
  public async login(): Promise<void> {}

  @Get('/redirect')
  @UseGuards(GithubAuthGuard)
  public async redirect(@GetUser() user: UserBeforeAuthentication, @Res({ passthrough: true }) res: Response): Promise<AuthTokens> {
    const tokens = await this.socialLogin(user)
    this.setCookies(res, tokens.refresh_token, tokens.access_token)
    return tokens
  }
}
