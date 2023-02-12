import { Response } from 'express'
import { EnvironmentConfigService } from 'src/infrastructure/config/environment-config.service'
import { AuthService } from 'src/infrastructure/services/auth/auth.service'
import { IBaseController } from './base-controller.interface'
import { Injectable } from '@nestjs/common'

@Injectable()
export abstract class BaseController implements IBaseController {
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
}
