import { Body, Controller, Get, Post, Redirect, Req, Res, Session, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Request, Response } from 'express'
import { AuthService } from './auth.service'
import { SignInDto } from './dto/sign-in.dto'
import { Roles } from '../roles/roles.decorator'
import { RolesGuard } from '../roles/roles.guard'
import { RolesEnum } from '../roles/roles.enum'
import { GoogleAuthGuard } from './strategies/google/google.guard'
import { SignUpDto } from './dto/sign-up.dto'
import { ConfigService } from '@nestjs/config'

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  private readonly REFRESH_TOKEN_COOKIE: string
  private readonly SESSION_ID_COOKIE: string

  constructor(private readonly authService: AuthService, private readonly configService: ConfigService) {
    this.REFRESH_TOKEN_COOKIE = configService.get<string>('REFRESH_TOKEN_COOKIE')
    this.SESSION_ID_COOKIE = configService.get<string>('SESSION_ID_COOKIE')
  }

  @Post('/signup')
  async signup(@Body() userDto: SignUpDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const userData = await this.authService.signup(userDto)
    res.cookie(this.REFRESH_TOKEN_COOKIE, userData.refresh_token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 })

    return userData
  }

  @Post('/login')
  async login(@Body() userDto: SignInDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const userData = await this.authService.login(userDto)
    res.cookie(this.REFRESH_TOKEN_COOKIE, userData.refresh_token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 })

    return userData
  }

  @Post('/logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies[this.REFRESH_TOKEN_COOKIE]
    res.clearCookie(this.REFRESH_TOKEN_COOKIE)

    return await this.authService.logout(refreshToken)
  }

  @Get('/refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies[this.REFRESH_TOKEN_COOKIE]
    const userData = await this.authService.refresh(refreshToken)
    res.cookie(this.REFRESH_TOKEN_COOKIE, userData.refresh_token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 })

    return userData
  }

  @Get('/roles')
  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  async roles(@Req() req: Request) {
    return 'access granted'
  }

  @Get('/google/login')
  @UseGuards(GoogleAuthGuard)
  async googleLogin(@Req() req: Request) {
    return { msg: 'Google Authentication' }
  }

  @Get('/google/redirect')
  @Redirect('/auth/success')
  @UseGuards(GoogleAuthGuard)
  async googleRedirect(@Req() req: Request) {
    console.log(req.user, ' <<<< GOOGLE REQ USER')

    return req.user
  }

  @Get('/status')
  user(@Req() req: Request) {
    if (req.user)
      return {
        status: 'social login',
        data: req.user
      }

    if (req.headers.authorization) return { status: 'jwt-token', data: req.headers.authorization }

    return 'unauthorized'
  }

  @Get('/success')
  success(@Req() req: Request, @Session() session: Record<string, any>) {
    console.log('success')
    return {
      user: req.user,
      session
    }
  }

  @Get('/google/logout')
  async googleLogout(@Session() session: Record<string, any>, @Res({ passthrough: true }) res: Response) {
    res.clearCookie(this.SESSION_ID_COOKIE)
    const data = await this.authService.googleLogout(session)
    if (session) return data
    return 'log out'
  }
}
