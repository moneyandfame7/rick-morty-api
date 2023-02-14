import { Controller, Get, Redirect, Req, Res, UseGuards } from '@nestjs/common'
import { Request, Response } from 'express'
import { EnvironmentConfigService } from '../../config/environment-config.service'
import { BaseController } from 'src/domain/controllers/auth/base-controller.abstract'
import { AuthService } from '../../services/auth/auth.service'
import { GoogleAuthGuard } from '../../common/guards/auth/google.guard'

@Controller('/auth/google')
export class GoogleController extends BaseController {
  constructor(readonly config: EnvironmentConfigService, readonly authService: AuthService) {
    super(config, authService)
  }

  @Get('/login')
  @UseGuards(GoogleAuthGuard)
  async googleLogin(@Req() req: Request) {}

  @Get('/redirect')
  @Redirect('/auth/finish', 302)
  @UseGuards(GoogleAuthGuard)
  async googleRedirect(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return await this.socialRedirect(req, res)
  }
}
