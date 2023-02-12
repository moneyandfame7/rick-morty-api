import { Controller, Get, Redirect, Req, Res, UseGuards } from '@nestjs/common'
import { GoogleAuthGuard } from '../../common/guards/auth/google.guard'
import { Request, Response } from 'express'
import { User } from '../../entities/common/user.entity'
import { EnvironmentConfigService } from '../../config/environment-config.service'
import { AuthService } from '../../services/auth/auth.service'
import { BaseController } from '../../../domain/controllers/auth/base-controller.abstract'

@Controller('/auth/google')
export class GoogleController extends BaseController {
  constructor(readonly config: EnvironmentConfigService, readonly authService: AuthService) {
    super(config, authService)
  }

  @Get('/login')
  @UseGuards(GoogleAuthGuard)
  async googleLogin(@Req() req: Request) {}

  @Get('/redirect')
  @Redirect('/auth/finish')
  @UseGuards(GoogleAuthGuard)
  async googleRedirect(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const jwt = await this.authService.socialLogin(req.user as User)
    this.setCookies(res, jwt.refresh_token, jwt.access_token)
  }
}
