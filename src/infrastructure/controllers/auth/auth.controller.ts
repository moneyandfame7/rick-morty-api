import { Body, Controller, Get, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Request, Response } from 'express'
import { JwtAuthGuard } from '../../common/guards/auth/jwt.guard'
import { SignInDto, SignUpDto } from '../../dto/auth/auth.dto'
import { User } from '../../entities/common/user.entity'
import { BaseController } from 'src/domain/controllers/auth/base-controller.abstract'
import { EnvironmentConfigService } from '../../config/environment-config.service'
import { AuthService } from '../../services/auth/auth.service'
import { UserService } from '../../services/common/user.service'
import { ResetPasswordDto, SetUsernameDto } from '../../dto/common/user.dto'

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

  @Get('/finish')
  @UseGuards(JwtAuthGuard)
  async finish(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = req.user as User
    const refreshToken = req.cookies[this.REFRESH_TOKEN_COOKIE]
    const accessToken = req.cookies[this.ACCESS_TOKEN_COOKIE]
    return {
      refreshToken,
      accessToken,
      user
    }
  }

  @Post('/change-username')
  @UseGuards(JwtAuthGuard)
  async changeUsername(@Req() req: Request, @Body() dto: SetUsernameDto, @Res({ passthrough: true }) res: Response) {
    const id = (req.user as User).id
    const user = await this.userService.changeUsername(id, dto.username)
    const jwt = await this.authService.buildUserInfoAndTokens(user)
    this.setCookies(res, jwt.refresh_token, jwt.access_token)

    return {
      refresh_token: jwt.refresh_token,
      access_token: jwt.access_token,
      user
    }
  }

  @Get('/reset-password')
  async resetPassword(@Req() req: Request, @Body() dto: ResetPasswordDto) {}
}
