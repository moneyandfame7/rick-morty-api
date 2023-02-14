import { Controller, Get, Redirect, Req, Res, UseGuards } from '@nestjs/common'
import { AuthService } from '../../services/auth/auth.service'
import { DiscordAuthGuard } from '../../common/guards/auth/discord.guard'
import { Request, Response } from 'express'
import { EnvironmentConfigService } from '../../config/environment-config.service'
import { BaseController } from 'src/domain/controllers/auth/base-controller.abstract'

@Controller('/auth/discord')
export class DiscordController extends BaseController {
  constructor(readonly config: EnvironmentConfigService, readonly authService: AuthService) {
    super(config, authService)
  }

  @Get('/login')
  @UseGuards(DiscordAuthGuard)
  async login(@Req() req: Request) {}

  @Get('/redirect')
  @Redirect('/auth/finish', 302)
  @UseGuards(DiscordAuthGuard)
  async redirect(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return await this.socialRedirect(req, res)
  }
}
