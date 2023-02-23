import { Injectable } from '@nestjs/common'
import type { Request, Response } from 'express'
import type { GeneratedTokens } from '@domain/models/common/token.model'
import { EnvironmentConfigService } from '@config/environment-config.service'
import { AuthService } from '@services/auth/auth.service'
import { UserService } from '@services/common/user.service'
import { TokenService } from '@services/common/token.service'
import { UserBeforeAuthentication } from '@domain/models/common/user.model'

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

  public async socialLogin(user: UserBeforeAuthentication) {
    const existUser = await this.userService.getOneByAuthType(user.email, user.auth_type)
    if (!existUser) {
      const token = this.tokenService.generateTempToken(user)
      return {
        message: 'User not registered, redirect to welcome page with this token:',
        token
      }
    }
    const existToken = await this.tokenService.getOneByUserId(existUser.id)
    /*
     * він сто пудов існує тому шо ми перевірили,
     * шо юзер існує ( коли створюється юзер, токен додається в дб )
     *  */
    const tokens = await this.authService.refresh(existToken!.refresh_token)
    /* зробити createProfileIfNotExists
     * з oauth отримуємо:
     * email
     * username
     * photo
     * auth_provider
     * */

    /* після створювання профілю:
    id,
    email,
    username ???? він має бути унікальним, чи треба викидувати error при створюванні, чи краще вже на клієнті, коли користувач спробує ввести юзернейм
    photo,
    role:user
    banned:false,
    ban_reason:null,
    auth_type,
    is_verified:true,
    verify_link:null,
    mail_subscribe:null ????? потрібно в entity прибрати nullable false
    country: теж саме ^
    *
    * */
    // * ПЛАН ДІЙ:
    // питання про кукі на бекенді
    // ???? -- як перевіряти, що юзер створений, але ще не був на welcome page? можливо додати якесь поле для самого юзера? ( щось типу is_activated )
    //!// 1. Перевіряєм, чи існує юзер. Якщо так - просто редірект на Home page і повертаєм токени.
    //? ПИТАННЯ - просто заново їх (токени) робити, чи якось за допомогою refresh. ( думаю через refresh, але треба сидіти подумати як це робити )
    //!// 2. Юзер не існує. Якщо це OAuth авторизація, деякі данні отримуємо звідти, і створюємо акаунт createAccountIfNotExists.
    //!//  Якщо це JWT - то створюємо акаунт, маючи email, password, auth_type
    //!// 3. Після успішної реєстрації - повертаємо токени і записуємо в локалсторедж or cookie. Редірект на Welcome Page.
    //!// З access token робимо запит на бекенд /welcome. Робимо валідацію токена, дістаємо юзера по айді (в токені буде id,username,і ще щось)
    //!// щоб юзер по потребі або по бажанню змінив username, задав country з списку можливих і чи хоче він отримувати розсилку на mail
    //!// 4. На welcome page ( на клієнті робиться запит на фронт updateUser????) і оновлюєм інфу. Повертаємо токени і на клієнті їх в
    //?? кукі або локал сторедж - ПИТАННЯ ПРО НИХ.
    //!// 5.
    // TODO: АБО ПРОСТО ЗАБИТИ ХУЙ НА ЦЮ ЗАЛУПУ І ШОБ ЮЗЕР АБАСРАЛСЯ І НЕ ЗМІГ СТВОРИТИ АКАУНТ ЯКЩО ТАКИЙ ЮЗЕРНЕЙМ ВЖЕ ЗАЙНЯТИЙ
    // ! ОСНОВНА ІНФА:
    // * якщо юзер вже існує, редірект на Home Page, якщо не існує - на Welcome page, щоб юзер заповнив деяку інформацію

    return {
      message: 'Already registered, redirect to home page',
      tokens,
      user: existUser
    }
  }
}
