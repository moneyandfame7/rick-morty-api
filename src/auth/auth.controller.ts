import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Request, Response } from 'express'
import { CreateUserDto } from '../user/dto/create-user.dto'
import { AuthService } from './auth.service'
import { SignInDto } from './dto/sign-in.dto'
import { JwtAuthGuard } from './strategies/jwt/jwt.guard'

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signup(@Body() userDto: CreateUserDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
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

  @UseGuards(JwtAuthGuard)
  @Get('/test')
  async test(@Req() req: Request) {
    console.log(req.user)
    console.log('abobaobaoboaobaobao')
    return 'ok'
  }
}
