import { Controller, Get, Redirect, Req, Res, UseGuards } from '@nestjs/common'
import { GithubAuthGuard } from '../../common/guards/auth/github.guard'
import { Request, Response } from 'express'
import { EnvironmentConfigService } from '../../config/environment-config.service'
import { AuthService } from '../../services/auth/auth.service'
import { BaseController } from 'src/domain/controllers/auth/base-controller.abstract'

@Controller('/auth/github')
export class GithubController extends BaseController {
  constructor(readonly config: EnvironmentConfigService, readonly authService: AuthService) {
    super(config, authService)
  }

  @Get('/login')
  @UseGuards(GithubAuthGuard)
  async login(@Req() req: Request): Promise<void> {}

  @Get('/redirect')
  @Redirect('/auth/finish', 302)
  @UseGuards(GithubAuthGuard)
  async redirect(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return await this.socialRedirect(req, res)
  }
}
