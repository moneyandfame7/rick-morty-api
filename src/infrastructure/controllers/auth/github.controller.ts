import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common'
import { Request, Response } from 'express'
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
  public async redirect(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = req.user as UserBeforeAuthentication
    const info = await this.socialLogin(user)
    this.setCookies(res, info.tokens.refresh_token, info.tokens.access_token)
    return info
  }
}
