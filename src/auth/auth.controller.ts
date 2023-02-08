import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Request, Response } from 'express'
import { AuthService } from './auth.service'
import { SignInDto } from './dto/sign-in.dto'
import { Roles } from '../roles/roles.decorator'
import { RolesGuard } from '../roles/roles.guard'
import { RolesEnum } from '../roles/roles.enum'
import { GoogleAuthGuard } from './strategies/google/google.guard'
import { SignUpDto } from './dto/sign-up.dto'

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signup(@Body() userDto: SignUpDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const userData = await this.authService.signup(userDto)
    res.cookie('refresh-token', userData.refresh_token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 })

    return userData
  }

  @Post('/login')
  async login(@Body() userDto: SignInDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const userData = await this.authService.login(userDto)
    res.cookie('refresh-token', userData.refresh_token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 })

    return userData
  }

  @Post('/logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies['refresh-token']
    res.clearCookie('refresh-token')

    return await this.authService.logout(refreshToken)
  }

  @Get('/refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies['refresh-token']
    const userData = await this.authService.refresh(refreshToken)
    res.cookie('refresh-token', userData.refresh_token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 })

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
  @UseGuards(GoogleAuthGuard)
  async googleRedirect(@Req() req: Request) {
    console.log(req.user, ' <<<< GOOGLE REQ USER')

    return req.user
  }

  @Get('/status')
  user(@Req() req: Request) {
    if (req.user) return 'social auth'
    if (req.headers.authorization) return 'jwt token'

    return 'unauthorized'
  }
}
