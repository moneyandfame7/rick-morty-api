import { Controller, Get, Res, UseGuards } from '@nestjs/common'
import type { Response } from 'express'

import { AuthorizationService } from '@app/services/authorization'
import { EnvironmentConfigService, TokenService, UserService } from '@app/services/common'

import { BaseAuthorizationController } from '@core/controllers/authorization'
import type { UserBeforeAuthentication } from '@core/models/common'
import type { AuthorizationTokens } from '@core/models/authorization'

import { GetUser } from '@common/decorators'
import { GithubAuthGuard } from '@common/guards/authorization'

@Controller('/auth/github')
export class GithubController extends BaseAuthorizationController {
  public constructor(
    protected readonly config: EnvironmentConfigService,
    protected readonly authService: AuthorizationService,
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
  public async redirect(@GetUser() user: UserBeforeAuthentication, @Res({ passthrough: true }) res: Response): Promise<AuthorizationTokens> {
    const tokens = await this.socialLogin(user)
    this.setCookies(res, tokens.refresh_token, tokens.access_token)
    return tokens
  }
}
