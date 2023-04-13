import { Controller, Get, Redirect, Res, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import type { Response } from 'express'

import { AuthorizationService } from '@app/services/authorization'
import { EnvironmentConfigService, TokenService, UserService } from '@app/services/common'

import { BaseAuthorizationController } from '@core/controllers/authorization'
import type { UserBeforeAuthentication } from '@core/models/common'
import { RedirectType } from '@core/models/authorization'

import { GetUser } from '@common/decorators'
import { GithubAuthGuard } from '@common/guards/authorization'

@Controller('/auth/github')
@ApiTags('github auth')
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
  @Redirect()
  @UseGuards(GithubAuthGuard)
  public async redirect(@GetUser() user: UserBeforeAuthentication): Promise<RedirectType> {
    const data = await this.socialLogin(user)
    return {
      url: `${this.SUCCESS_CLIENT_REDIRECT}?refresh=${data.refresh_token}&access=${data.access_token}`
    }
  }
}
