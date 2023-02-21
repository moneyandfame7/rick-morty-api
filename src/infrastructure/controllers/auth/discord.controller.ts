import { Controller, Get, Redirect, Req, Res, UseGuards } from '@nestjs/common'
import { Request, Response } from 'express'
import { AuthService } from '@services/auth/auth.service'
import { DiscordAuthGuard } from '@common/guards/auth/discord.guard'
import { EnvironmentConfigService } from '@config/environment-config.service'
import { BaseController } from 'src/domain/controllers/auth/base-controller.abstract'
import type { AuthRedirect } from '@domain/models/auth/auth.model'

@Controller('/auth/discord')
export class DiscordController extends BaseController {
  constructor(readonly config: EnvironmentConfigService, readonly authService: AuthService) {
    super(config, authService)
  }

  @Get('/login')
  @UseGuards(DiscordAuthGuard)
  public async login(): Promise<void> {}

  @Get('/redirect')
  @Redirect('/auth/finish', 302)
  @UseGuards(DiscordAuthGuard)
  public async redirect(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<AuthRedirect> {
    return this.socialRedirect(req, res)
  }
}
