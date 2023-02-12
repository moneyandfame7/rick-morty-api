import { Body, Controller, Get, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Request, Response } from 'express'
import { Roles } from '../../common/decorators/roles.decorator'
import { RolesGuard } from '../../common/guards/roles.guard'
import { JwtAuthGuard } from '../../common/guards/auth/jwt.guard'
import { RolesEnum } from '../../common/constants/roles.enum'
import { SignInDto, SignUpDto } from '../../dto/auth/auth.dto'
import { User } from '../../entities/common/user.entity'
import { BaseController } from '../../../domain/controllers/auth/base-controller.abstract'
import { EnvironmentConfigService } from '../../config/environment-config.service'
import { AuthService } from '../../services/auth/auth.service'
import { UserService } from '../../services/common/user.service'

@Controller('auth')
@ApiTags('auth')
export class AuthController extends BaseController {
  constructor(readonly config: EnvironmentConfigService, readonly authService: AuthService, readonly userService: UserService) {
    super(config, authService)
  }

  @Post('/signup')
  private async signup(@Body() userDto: SignUpDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const userData = await this.authService.signup(userDto)
    this.setCookies(res, userData.refresh_token, userData.access_token)

    return userData
  }

  @Post('/login')
  private async login(@Body() userDto: SignInDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const userData = await this.authService.login(userDto)
    this.setCookies(res, userData.refresh_token, userData.access_token)

    return userData
  }

  @Get('/logout')
  @UseGuards(JwtAuthGuard)
  private async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
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
  @UseGuards(JwtAuthGuard)
  private async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies[this.REFRESH_TOKEN_COOKIE]
    const userData = await this.authService.refresh(refreshToken)
    this.setCookies(res, userData.refresh_token, userData.access_token)
    return userData
  }

  @Get('/protected')
  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  async protected(@Req() req: Request) {
    console.log(req.user)
    return 'access granted'
  }

  @Get('/finish')
  @UseGuards(JwtAuthGuard)
  private async finish(@Req() req: Request) {
    const user = req.user as User
    const refreshToken = req.cookies[this.REFRESH_TOKEN_COOKIE]
    const accessToken = req.cookies[this.ACCESS_TOKEN_COOKIE]
    return {
      refreshToken,
      accessToken,
      user
    }
  }
}
