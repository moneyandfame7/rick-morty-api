import { Controller, Get, Redirect, Res, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import type { Response } from 'express'

import { EnvironmentConfigService, TokenService, UserService } from '@app/services/common'
import { AuthorizationService } from '@app/services/authorization'

import { BaseAuthorizationController } from '@core/controllers/authorization'
import type { UserBeforeAuthentication } from '@core/models/common'
import { RedirectType } from '@core/models/authorization'

import { GetUser } from '@common/decorators'
import { GoogleAuthGuard } from '@common/guards/authorization'

@Controller('/auth/google')
@ApiTags('google auth')
export class GoogleController extends BaseAuthorizationController {
  public constructor(
    protected readonly config: EnvironmentConfigService,
    protected readonly authService: AuthorizationService,
    protected readonly userService: UserService,
    protected readonly tokenService: TokenService
  ) {
    super(config, authService, userService, tokenService)
  }

  @Get('/login')
  @UseGuards(GoogleAuthGuard)
  public async login(): Promise<void> {}

  @Get('/redirect')
  @Redirect()
  @UseGuards(GoogleAuthGuard)
  public async redirect(@GetUser() user: UserBeforeAuthentication, @Res({ passthrough: true }) res: Response): Promise<RedirectType> {
    const data = await this.socialLogin(user)
    this.setCookies(res, data.refresh_token, data.access_token)
    return {
      url: this.SUCCESS_CLIENT_REDIRECT
    }
  }
}
