import { Controller, Get, Redirect, Req, Res, UseGuards } from '@nestjs/common'
import { SpotifyAuthGuard } from '@common/guards/auth/spotify.guard'
import { Request, Response } from 'express'
import { EnvironmentConfigService } from '@config/environment-config.service'
import { AuthService } from '@services/auth/auth.service'
import { BaseController } from '@domain/controllers/auth/base-controller.abstract'
import type { AuthRedirect } from '@domain/models/auth/auth.model'

@Controller('/auth/spotify')
export class SpotifyController extends BaseController {
  constructor(readonly config: EnvironmentConfigService, readonly authService: AuthService) {
    super(config, authService)
  }

  @Get('/login')
  @UseGuards(SpotifyAuthGuard)
  public async login(): Promise<void> {}

  @Get('/redirect')
  @Redirect('/auth/finish', 302)
  @UseGuards(SpotifyAuthGuard)
  public async redirect(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<AuthRedirect> {
    return this.socialRedirect(req, res)
  }
}
