import { Injectable } from '@nestjs/common'
import { Request, Response } from 'express'
import { EnvironmentConfigService } from 'src/infrastructure/config/environment-config.service'
import { AuthService } from 'src/infrastructure/services/auth/auth.service'
import { User } from 'src/infrastructure/entities/common/user.entity'

@Injectable()
export abstract class BaseController {
  readonly REFRESH_TOKEN_COOKIE: string
  readonly ACCESS_TOKEN_COOKIE: string
  readonly REFRESH_TOKEN_EXPIRE_COOKIE: number = 30 * 24 * 60 * 60 * 1000 // 30 days
  readonly ACCESS_TOKEN_EXPIRE_COOKIE: number = 30 * 60 * 1000 // 30 minutes
  protected constructor(readonly config: EnvironmentConfigService, readonly authService: AuthService) {
    this.REFRESH_TOKEN_COOKIE = this.config.getJwtRefreshCookie()
    this.ACCESS_TOKEN_COOKIE = this.config.getJwtAccessCookie()
  }

  setCookies(res: Response, refresh_token, access_token) {
    res.cookie(this.REFRESH_TOKEN_COOKIE, refresh_token, {
      httpOnly: true,
      maxAge: this.REFRESH_TOKEN_EXPIRE_COOKIE
    })
    res.cookie(this.ACCESS_TOKEN_COOKIE, access_token, {
      httpOnly: true,
      maxAge: this.ACCESS_TOKEN_EXPIRE_COOKIE
    })
  }
  getCookies(req: Request) {
    return {
      refresh_token: req.cookies[this.REFRESH_TOKEN_COOKIE],
      access_token: req.cookies[this.ACCESS_TOKEN_COOKIE]
    }
  }
  clearCookies(res: Response) {
    res.clearCookie(this.REFRESH_TOKEN_COOKIE)
    res.clearCookie(this.ACCESS_TOKEN_COOKIE)
  }
  async socialRedirect(req: Request, res: Response) {
    const jwt = await this.authService.buildUserInfoAndTokens(req.user as User)
    this.setCookies(res, jwt.refresh_token, jwt.access_token)
    if (jwt.user.username === '$N33d t0 Ch@ng3') return { url: '/auth/change-username' }

    return { url: '/auth/finish' }
  }
}
