import { Controller, Get, Req, UseGuards } from '@nestjs/common'
import { Request } from 'express'
import { GithubAuthGuard } from '@common/guards/auth/github.guard'
import { EnvironmentConfigService } from '@config/environment-config.service'
import { AuthService } from '@services/auth/auth.service'
import { BaseController } from '@domain/controllers/auth/base-controller.abstract'
import { UserService } from '@services/common/user.service'
import { UserBeforeAuthentication } from '@domain/models/common/user.model'
import { TokenService } from '@services/common/token.service'

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
  public redirect(@Req() req: Request) {
    const user = req.user as UserBeforeAuthentication
    return this.socialLogin(user)
  }
}
