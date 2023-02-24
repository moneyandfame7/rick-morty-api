import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common'
import { Request, Response } from 'express'
import { AuthService } from '@services/auth/auth.service'
import { DiscordAuthGuard } from '@common/guards/auth/discord.guard'
import { EnvironmentConfigService } from '@config/environment-config.service'
import { BaseController } from '@domain/controllers/auth/base-controller'
import { UserService } from '@services/common/user.service'
import { TokenService } from '@services/common/token.service'
import { UserBeforeAuthentication } from '@domain/models/common/user.model'
import { AuthTokens } from '@domain/models/auth/auth.model'

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
