import type { Request, Response } from 'express'

import { AuthorizationService } from '@app/services/authorization'
import { EnvironmentConfigService, TokenService, UserService } from '@app/services/common'

import type { GeneratedTokens, UserBeforeAuthentication } from '@core/models/common'
import { AuthResponse } from '@core/models/authorization'

export class BaseAuthorizationController {
  public readonly SUCCESS_CLIENT_REDIRECT: string
  public readonly CLIENT_URL: string
  public readonly REFRESH_TOKEN_COOKIE: string
  public readonly ACCESS_TOKEN_COOKIE: string
  public readonly REFRESH_EXPIRES: number
  public readonly ACCESS_EXPIRES: number
  protected constructor(
    protected readonly config: EnvironmentConfigService,
    protected readonly authService: AuthorizationService,
    protected readonly userService: UserService,
    protected tokenService: TokenService
  ) {
    this.REFRESH_TOKEN_COOKIE = this.config.getJwtRefreshCookie()
    this.ACCESS_TOKEN_COOKIE = this.config.getJwtAccessCookie()
    this.REFRESH_EXPIRES = this.config.getJwtRefreshExpires()
    this.ACCESS_EXPIRES = this.config.getJwtAccessExpires()
    this.CLIENT_URL = this.config.getClientUrl()
    this.SUCCESS_CLIENT_REDIRECT = this.config.getClientSuccessRedirect()
  }

  public setCookies(res: Response, refresh_token: string, access_token: string): void {
    this.setAccessToCookie(res, access_token)
    this.setRefreshToCookie(res, refresh_token)

    /* process.env.COOKIE_DOMAN ?? undefined */
    /* if production, set domain, else localhost or undefined? */
  }

  public setAccessToCookie(res: Response, access_token: string): void {
    res.cookie(this.ACCESS_TOKEN_COOKIE, access_token, {
      maxAge: this.ACCESS_EXPIRES,
      secure: true,
      sameSite: 'none'
    })
  }

  public setRefreshToCookie(res: Response, refresh_token: string): void {
    res.cookie(this.REFRESH_TOKEN_COOKIE, refresh_token, {
      maxAge: this.REFRESH_EXPIRES,
      secure: true,
      sameSite: 'none'
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

  public async socialLogin(user: UserBeforeAuthentication): Promise<AuthResponse> {
    const existUser = await this.userService.getOneByAuthType(user.email, user.auth_type)

    if (existUser) {
      return this.authService.buildUserInfoAndTokens(existUser)
    }

    const info: UserBeforeAuthentication = {
      email: user.email,
      photo: user.photo,
      username: user.username,
      auth_type: user.auth_type,
      is_verified: true
    }
    const createdUser = await this.userService.createOne(info)

    return this.authService.buildUserInfoAndTokens(createdUser)
  }
}
