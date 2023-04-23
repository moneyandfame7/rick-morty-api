import { Controller, Get, Redirect, Res, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import type { Response } from 'express'

import { AuthorizationService } from '@app/services/authorization'
import { EnvironmentConfigService, TokenService, UserService } from '@app/services/common'

import type { UserBeforeAuthentication } from '@core/models/common'
import { RedirectType } from '@core/models/authorization'
import { BaseAuthorizationController } from '@core/controllers/authorization'

import { SpotifyAuthGuard } from '@common/guards/authorization'
import { GetUser } from '@common/decorators/user.decorator'

@Controller('/auth/spotify')
@ApiTags('spotify auth')
export class SpotifyController extends BaseAuthorizationController {
  public constructor(
    protected readonly config: EnvironmentConfigService,
    protected readonly authService: AuthorizationService,
    protected readonly userService: UserService,
    protected readonly tokenService: TokenService
  ) {
    super(config, authService, userService, tokenService)
  }

  @Get('/login')
  @UseGuards(SpotifyAuthGuard)
  public async login(): Promise<void> {}

  @Get('/redirect')
  @Redirect()
  @UseGuards(SpotifyAuthGuard)
  public async redirect(@GetUser() user: UserBeforeAuthentication, @Res({ passthrough: true }) res: Response): Promise<RedirectType> {
    const data = await this.socialLogin(user)
    this.setCookies(res, data.refresh_token, data.access_token)
    return {
      url: `${this.SUCCESS_CLIENT_REDIRECT}?access=${data.access_token}&refresh=${data.refresh_token}`
    }
  }
}
