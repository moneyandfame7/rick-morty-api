import { Controller, Get, Req, UseGuards } from '@nestjs/common'
import { Request } from 'express'
import { AuthService } from '@services/auth/auth.service'
import { DiscordAuthGuard } from '@common/guards/auth/discord.guard'
import { EnvironmentConfigService } from '@config/environment-config.service'
import { BaseController } from 'src/domain/controllers/auth/base-controller.abstract'
import { UserService } from '@services/common/user.service'
import { TokenService } from '@services/common/token.service'
import { UserBeforeAuthentication } from '@domain/models/common/user.model'

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
  public redirect(@Req() req: Request) {
    const user = req.user as UserBeforeAuthentication
    return this.socialLogin(user)
  }
}
