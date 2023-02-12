import { Controller, Get, Redirect, Req, Res, UseGuards } from '@nestjs/common'
import { SpotifyAuthGuard } from '../../common/guards/auth/spotify.guard'
import { Request, Response } from 'express'
import { User } from '../../entities/common/user.entity'
import { EnvironmentConfigService } from '../../config/environment-config.service'
import { AuthService } from '../../services/auth/auth.service'
import { BaseController } from '../../../domain/controllers/auth/base-controller.abstract'

@Controller('/auth/spotify')
export class SpotifyController extends BaseController {
  constructor(readonly config: EnvironmentConfigService, readonly authService: AuthService) {
    super(config, authService)
  }

  @Get('/login')
  @UseGuards(SpotifyAuthGuard)
  async login(@Req() req: Request) {}

  @Get('/redirect')
  @Redirect('/auth/finish')
  @UseGuards(SpotifyAuthGuard)
  async redirect(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const jwt = await this.authService.socialLogin(req.user as User)
    this.setCookies(res, jwt.refresh_token, jwt.access_token)
  }
}
