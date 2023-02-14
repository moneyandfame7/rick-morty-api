import { Controller, Get, Redirect, Req, Res, UseGuards } from '@nestjs/common'
import { SpotifyAuthGuard } from '../../common/guards/auth/spotify.guard'
import { Request, Response } from 'express'
import { EnvironmentConfigService } from '../../config/environment-config.service'
import { AuthService } from '../../services/auth/auth.service'
import { BaseController } from 'src/domain/controllers/auth/base-controller.abstract'

@Controller('/auth/spotify')
export class SpotifyController extends BaseController {
  constructor(readonly config: EnvironmentConfigService, readonly authService: AuthService) {
    super(config, authService)
  }

  @Get('/login')
  @UseGuards(SpotifyAuthGuard)
  async login(@Req() req: Request) {}

  @Get('/redirect')
  @Redirect('/auth/finish', 302)
  @UseGuards(SpotifyAuthGuard)
  async redirect(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return await this.socialRedirect(req, res)
  }
}
