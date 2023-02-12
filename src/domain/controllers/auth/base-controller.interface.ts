import { Response } from 'express'

export interface IBaseController {
  REFRESH_TOKEN_COOKIE: string
  ACCESS_TOKEN_COOKIE: string
  REFRESH_TOKEN_EXPIRE_COOKIE: number
  ACCESS_TOKEN_EXPIRE_COOKIE: number

  setCookies(res: Response, refresh_token: string, access_token: string): void
}
