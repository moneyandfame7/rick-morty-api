import { Controller, Get, Redirect, Req, Res, UseGuards } from '@nestjs/common'
import { Request, Response } from 'express'
import { EnvironmentConfigService } from '@config/environment-config.service'
import { BaseController } from '@domain/controllers/auth/base-controller.abstract'
import { AuthService } from '@services/auth/auth.service'
import { GoogleAuthGuard } from '@common/guards/auth/google.guard'
import type { AuthRedirect } from '@domain/models/auth/auth.model'

@Controller('/auth/google')
export class GoogleController extends BaseController {
  constructor(readonly config: EnvironmentConfigService, readonly authService: AuthService) {
    super(config, authService)
  }

  @Get('/login')
  @UseGuards(GoogleAuthGuard)
  public async login(): Promise<void> {}

  @Get('/redirect')
  @Redirect('/auth/finish', 302)
  @UseGuards(GoogleAuthGuard)
  public async redirect(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<AuthRedirect> {
    return this.socialRedirect(req, res)
  }
}
