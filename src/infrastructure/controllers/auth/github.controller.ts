import { Controller, Get, Redirect, Req, Res, UseGuards } from '@nestjs/common'
import { Request, Response } from 'express'
import { GithubAuthGuard } from '@common/guards/auth/github.guard'
import { EnvironmentConfigService } from '@config/environment-config.service'
import { AuthService } from '@services/auth/auth.service'
import { BaseController } from '@domain/controllers/auth/base-controller.abstract'
import type { AuthRedirect } from '@domain/models/auth/auth.model'

@Controller('/auth/github')
export class GithubController extends BaseController {
  constructor(readonly config: EnvironmentConfigService, readonly authService: AuthService) {
    super(config, authService)
  }

  @Get('/login')
  @UseGuards(GithubAuthGuard)
  public async login(): Promise<void> {}

  @Get('/redirect')
  @Redirect('/auth/finish', 302)
  @UseGuards(GithubAuthGuard)
  public async redirect(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<AuthRedirect> {
    return this.socialRedirect(req, res)
  }
}
