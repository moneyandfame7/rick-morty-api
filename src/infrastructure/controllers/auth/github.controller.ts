import { Controller, Get, Redirect, Req, Res, UseGuards } from '@nestjs/common'
import { GithubAuthGuard } from '../../common/guards/auth/github.guard'
import { Request, Response } from 'express'
import { User } from '../../entities/common/user.entity'
import { EnvironmentConfigService } from '../../config/environment-config.service'
import { AuthService } from '../../services/auth/auth.service'
import { BaseController } from 'src/domain/controllers/auth/base-controller.abstract'

@Controller('/auth/github')
export class GithubController extends BaseController {
  constructor(readonly config: EnvironmentConfigService, readonly authService: AuthService) {
    super(config, authService)
  }
  @Get('/github/login')
  @UseGuards(GithubAuthGuard)
  async login(@Req() req: Request): Promise<void> {}

  @Get('/github/redirect')
  @Redirect('/auth/finish')
  @UseGuards(GithubAuthGuard)
  async redirect(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const jwt = await this.authService.buildUserInfoAndTokens(req.user as User)
    this.setCookies(res, jwt.refresh_token, jwt.access_token)
  }
}
