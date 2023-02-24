import { Injectable } from '@nestjs/common'
import { Request, Response } from 'express'

import { AuthService } from '@app/services/auth/auth.service'
import { UserService } from '@app/services/common/user.service'
import { TokenService } from '@app/services/common/token.service'

import { AuthTokens } from '@core/models/auth/auth.model'
import { UserBeforeAuthentication } from '@core/models/common/user.model'
import { GeneratedTokens } from '@core/models/common/token.model'

import { EnvironmentConfigService } from '@app/services/common/environment-config.service'

@Injectable()
export class BaseController {
  public readonly CLIENT_URL: string
  public readonly REFRESH_TOKEN_COOKIE: string
  public readonly ACCESS_TOKEN_COOKIE: string
  public readonly REFRESH_TOKEN_EXPIRE_COOKIE: number = 30 * 24 * 60 * 60 * 1000 // 30 days
  public readonly ACCESS_TOKEN_EXPIRE_COOKIE: number = 30 * 60 * 1000 // 30 minutes
  protected constructor(
    protected readonly config: EnvironmentConfigService,
    protected readonly authService: AuthService,
    protected readonly userService: UserService,
    protected tokenService: TokenService
  ) {
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

  public async socialLogin(user: UserBeforeAuthentication): Promise<AuthTokens> {
    const existUser = await this.userService.getOneByAuthType(user.email, user.auth_type)
    // @TODO: зробити тип який повертається на клієнт, мб status, message, body чи щось таке. або просто токени, але розписати по логіці, шо коли відбувається

    if (existUser) {
      return this.authService.buildUserInfoAndTokens(existUser)
      // const ifPassedWelcomePage = existUser.country || existUser.username || existUser.mail_subscribe
      // return {
      //   message: ifPassedWelcomePage ? 'User is finished registration' : 'User is redirected to welcome page',
      //   user: existUser,
      //   tokens
      // }
    }

    const info: UserBeforeAuthentication = {
      email: user.email,
      username: user.username,
      auth_type: user.auth_type,
      is_verified: true
    }
    const createdUser = await this.userService.createOne(info)
    return this.authService.buildUserInfoAndTokens(createdUser)
  }
}
