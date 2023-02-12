import { Controller, Get, Redirect, Req, Res, UseGuards } from '@nestjs/common'
import { GoogleAuthGuard } from '../../common/guards/auth/google.guard'
import { Request, Response } from 'express'
import { User } from '../../entities/common/user.entity'
import { EnvironmentConfigService } from '../../config/environment-config.service'
import { AuthService } from '../../services/auth/auth.service'

@Controller('/auth/google')
export class GoogleController {
  private readonly REFRESH_TOKEN_COOKIE: string
  private readonly ACCESS_TOKEN_COOKIE: string

  constructor(private readonly config: EnvironmentConfigService, private readonly authService: AuthService) {
    this.REFRESH_TOKEN_COOKIE = this.config.getJwtRefreshCookie()
    this.ACCESS_TOKEN_COOKIE = this.config.getJwtAccessCookie()
  }

  @Get('/login')
  @UseGuards(GoogleAuthGuard)
  async googleLogin(@Req() req: Request) {}

  @Get('/redirect')
  @Redirect('/auth/finish')
  @UseGuards(GoogleAuthGuard)
  async googleRedirect(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const jwt = await this.authService.socialLogin(req.user as User)
    res.cookie(this.REFRESH_TOKEN_COOKIE, jwt.refresh_token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000
    })
    res.cookie(this.ACCESS_TOKEN_COOKIE, jwt.access_token, {
      httpOnly: true,
      maxAge: 1800000
    })
  }
}
