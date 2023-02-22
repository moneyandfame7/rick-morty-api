import { Body, Controller, Get, Param, Post, Query, Redirect, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Request, Response } from 'express'
import { JwtAuthGuard } from '@common/guards/auth/jwt.guard'
import { SignInDto, SignUpDto } from '@dto/auth/auth.dto'
import { BaseController } from 'src/domain/controllers/auth/base-controller.abstract'
import { EnvironmentConfigService } from '@config/environment-config.service'
import { AuthService } from '@services/auth/auth.service'
import { UserService } from '@services/common/user.service'
import { EmailDto, ResetPasswordDto, UserDetailsDto } from '@dto/common/user.dto'
import type { User } from '@entities/common/user.entity'
import { type AuthRedirect, type AuthTokensWithUser } from '@domain/models/auth/auth.model'
import type { Token } from '@entities/common/token.entity'

@Controller('auth')
@ApiTags('auth')
export class AuthController extends BaseController {
  constructor(readonly config: EnvironmentConfigService, readonly authService: AuthService, readonly userService: UserService) {
    super(config, authService, userService)
  }

  @Post('/signup')
  public async signup(@Body() dto: SignUpDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    // TODO: робити на клієнті редірект на сторінку /welcome де задавати юзернейм і іншу інфу
    const userData = await this.authService.signup(dto)
    return userData.access_token
    // return `${this.config.getBaseUrl()}/auth/welcome?token=${userData.access_token}`
  }

  @Post('/login')
  public async login(@Body() userDto: SignInDto, @Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<AuthTokensWithUser> {
    const userData = await this.authService.login(userDto)
    this.setCookies(res, userData.refresh_token, userData.access_token)

    return userData
  }

  @Get('/logout')
  @UseGuards(JwtAuthGuard)
  public async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<Token> {
    const { access_token, refresh_token } = this.getCookies(req)
    if (access_token && refresh_token) {
      this.clearCookies(res)
      return this.authService.logout(refresh_token)
    }

    throw new UnauthorizedException()
  }

  @Get('/refresh')
  public async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<AuthTokensWithUser> {
    const { refresh_token } = this.getCookies(req)
    const userData = await this.authService.refresh(refresh_token)
    this.setCookies(res, userData.refresh_token, userData.access_token)
    return userData
  }

  @Get('/verify/:link')
  @Redirect('', 302)
  public async verify(@Param('link') link: string, @Res({ passthrough: true }) res: Response): Promise<AuthRedirect> {
    const userData = await this.authService.verify(link)
    this.setCookies(res, userData.refresh_token, userData.access_token)
    return {
      url: this.CLIENT_URL
    }
  }

  @Get('/status')
  @UseGuards(JwtAuthGuard)
  public finish(@Req() req: Request): AuthTokensWithUser {
    const payload = req.user as User
    const { refresh_token, access_token } = this.getCookies(req)
    return {
      refresh_token,
      access_token,
      payload
    }
  }

  @Post('/welcome')
  public async welcome(@Query('token') token: string, @Body() details: UserDetailsDto, @Res({ passthrough: true }) res: Response) {
    const userData = await this.authService.welcome(token, details)
    this.setCookies(res, userData.refresh_token, userData.access_token)
    return userData
  }

  @Post('/forgot')
  public async forgot(@Body() dto: EmailDto) {
    return this.authService.forgot(dto.email)
  }

  @Post('/reset/:id/:token')
  public async reset(@Param('id') id: string, @Param('token') token: string, @Body() dto: ResetPasswordDto, @Res({ passthrough: true }) res: Response) {
    const user = await this.authService.reset(id, token, dto)
    const userData = await this.authService.buildUserInfoAndTokens(user)
    this.setCookies(res, userData.refresh_token, userData.access_token)

    return userData
  }
}
