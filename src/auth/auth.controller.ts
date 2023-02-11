import { Body, Controller, Get, Post, Redirect, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import { Request, Response } from 'express'

import { AuthService } from './auth.service'
import { SignInDto } from './dto/sign-in.dto'
import { Roles } from '../roles/roles.decorator'
import { RolesGuard } from '../roles/roles.guard'
import { RolesEnum } from '../roles/roles.enum'
import { GoogleAuthGuard } from './strategies/google/google.guard'
import { SignUpDto } from './dto/sign-up.dto'
import { JwtAuthGuard } from './strategies/jwt/jwt.guard'
import { User } from '../user/entities/user.entity'

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  private readonly REFRESH_TOKEN_COOKIE: string
  private readonly ACCESS_TOKEN_COOKIE: string
  private readonly SESSION_ID_COOKIE: string

  constructor(private readonly authService: AuthService, private readonly configService: ConfigService) {
    this.REFRESH_TOKEN_COOKIE = configService.get<string>('REFRESH_TOKEN_COOKIE')
    this.ACCESS_TOKEN_COOKIE = configService.get<string>('ACCESS_TOKEN_COOKIE')
    this.SESSION_ID_COOKIE = configService.get<string>('SESSION_ID_COOKIE')
  }

  @Post('/signup')
  async signup(@Body() userDto: SignUpDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const userData = await this.authService.signup(userDto)
    res.cookie(this.REFRESH_TOKEN_COOKIE, userData.refresh_token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000
    })
    res.cookie(this.ACCESS_TOKEN_COOKIE, userData.access_token, {
      httpOnly: true,
      maxAge: 1800000
    })

    return userData
  }

  @Post('/login')
  async login(@Body() userDto: SignInDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const userData = await this.authService.login(userDto)
    res.cookie(this.REFRESH_TOKEN_COOKIE, userData.refresh_token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    })
    res.cookie(this.ACCESS_TOKEN_COOKIE, userData.access_token, {
      httpOnly: true,
      maxAge: 1800000 // 25 m
    })
    return userData
  }

  @Get('/logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies[this.REFRESH_TOKEN_COOKIE]
    const accessToken = req.cookies[this.ACCESS_TOKEN_COOKIE]
    if (refreshToken && accessToken) {
      res.clearCookie(this.REFRESH_TOKEN_COOKIE)
      res.clearCookie(this.ACCESS_TOKEN_COOKIE)
      return await this.authService.logout(refreshToken)
    }

    throw new UnauthorizedException('User unauthorized')
  }

  @Get('/refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    console.log('refresh <<<< ')
    const refreshToken = req.cookies[this.REFRESH_TOKEN_COOKIE]
    const userData = await this.authService.refresh(refreshToken)
    console.log(userData, ' <<< REFRESH USER DATA')
    res.cookie(this.REFRESH_TOKEN_COOKIE, userData.refresh_token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000
    })
    res.cookie(this.ACCESS_TOKEN_COOKIE, userData.access_token, {
      httpOnly: true,
      maxAge: 1800000
    })
    return userData
  }

  @Get('/protected')
  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  async protected(@Req() req: Request) {
    console.log(req.user)
    return 'access granted'
  }

  @Get('/authorized')
  @UseGuards(JwtAuthGuard)
  async authorizedOnly(@Req() req: Request) {
    return { msg: 'access granted', token: req.cookies[this.REFRESH_TOKEN_COOKIE] }
  }

  @Get('/google/login')
  @UseGuards(GoogleAuthGuard)
  async googleLogin(@Req() req: Request) {}

  @Get('/google/redirect')
  @Redirect('finish')
  @UseGuards(GoogleAuthGuard)
  async googleRedirect(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const jwt = await this.authService.googleLogin(req.user as User)
    res.cookie(this.REFRESH_TOKEN_COOKIE, jwt.refresh_token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000
    })
    res.cookie(this.ACCESS_TOKEN_COOKIE, jwt.access_token, {
      httpOnly: true,
      maxAge: 1800000
    })
  }

  @Get('/google/finish')
  @UseGuards(JwtAuthGuard)
  async finish(@Req() req: Request) {
    const user = req.user as User
    // перевіряти чи новий юзер чи ні ( показати google.strategy.ts )
    // робити тут редірект щоб юзер встановив пароль, якщо це новий юзер, якщо ні то просто виводити success
    // const finishedData = await this.authService.googleFinish(user, password)
    // console.log(await bcrypt.compare(password, finishedData.password))
    // return finishedData

    return user
  }
}
