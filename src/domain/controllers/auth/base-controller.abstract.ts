import { Injectable } from '@nestjs/common'
import type { Request, Response } from 'express'
import type { User } from '@entities/common/user.entity'
import type { GeneratedTokens } from '@domain/models/common/token.model'
import type { AuthRedirect } from '@domain/models/auth/auth.model'
import { EnvironmentConfigService } from '@config/environment-config.service'
import { AuthService } from '@services/auth/auth.service'

@Injectable()
export abstract class BaseController {
  public readonly CLIENT_URL: string
  public readonly REFRESH_TOKEN_COOKIE: string
  public readonly ACCESS_TOKEN_COOKIE: string
  public readonly REFRESH_TOKEN_EXPIRE_COOKIE: number = 30 * 24 * 60 * 60 * 1000 // 30 days
  public readonly ACCESS_TOKEN_EXPIRE_COOKIE: number = 30 * 60 * 1000 // 30 minutes
  protected constructor(readonly config: EnvironmentConfigService, readonly authService: AuthService) {
    this.REFRESH_TOKEN_COOKIE = this.config.getJwtRefreshCookie()
    this.ACCESS_TOKEN_COOKIE = this.config.getJwtAccessCookie()
    this.CLIENT_URL = this.config.getClientUrl()
  }

  public setCookies(res: Response, refresh_token: string, access_token: string): void {
    res.cookie(this.REFRESH_TOKEN_COOKIE, refresh_token, {
      httpOnly: true,
      maxAge: this.REFRESH_TOKEN_EXPIRE_COOKIE
    })
    res.cookie(this.ACCESS_TOKEN_COOKIE, access_token, {
      httpOnly: true,
      maxAge: this.ACCESS_TOKEN_EXPIRE_COOKIE
    })
  }

  public getCookies(req: Request): GeneratedTokens {
    return {
      refresh_token: req.cookies[this.REFRESH_TOKEN_COOKIE],
      access_token: req.cookies[this.ACCESS_TOKEN_COOKIE]
    }
  }

  public clearCookies(res: Response): void {
    res.clearCookie(this.REFRESH_TOKEN_COOKIE)
    res.clearCookie(this.ACCESS_TOKEN_COOKIE)
  }

  public async socialRedirect(req: Request, res: Response): Promise<AuthRedirect> {
    const jwt = await this.authService.buildUserInfoAndTokens(req.user as User)
    this.setCookies(res, jwt.refresh_token, jwt.access_token)
    if (jwt.user.username === '$N33d t0 Ch@ng3') return { url: '/auth/change-username' }

    return { url: '/auth/finish' }
  }
}
