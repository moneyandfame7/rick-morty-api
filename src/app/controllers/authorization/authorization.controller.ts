import { Body, Controller, Get, Param, Post, Query, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import type { Request, Response } from 'express'

import { AuthorizationService } from '@app/services/authorization'
import { EnvironmentConfigService, TokenService, UserService } from '@app/services/common'
import { ResetPasswordDto, UserDetailsDto } from '@app/dto/common'
import { ForgotDto, LoginDto, SignupDto } from '@app/dto/authorization'

import { Token } from '@infrastructure/entities/common'

import { BaseAuthorizationController } from '@core/controllers/authorization'
import type { AuthResponse, JwtPayload, RefreshTokenResponse } from '@core/models/authorization'

import { JwtAuthGuard } from '@common/guards/authorization'
import { GetUser } from '@common/decorators'

@Controller('/auth')
@ApiTags('/auth')
export class AuthorizationController extends BaseAuthorizationController {
  public constructor(
    protected readonly config: EnvironmentConfigService,
    protected readonly authService: AuthorizationService,
    protected readonly userService: UserService,
    protected readonly tokenService: TokenService
  ) {
    super(config, authService, userService, tokenService)
  }

  @Post('/signup')
  public async signup(@Body() dto: SignupDto, @Res({ passthrough: true }) res: Response): Promise<AuthResponse> {
    const data = await this.authService.signup(dto)
    this.setCookies(res, data.refresh_token, data.access_token)

    return data
  }

  @Post('/login')
  public async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response): Promise<AuthResponse> {
    const data = await this.authService.login(dto)
    this.setCookies(res, data.refresh_token, data.access_token)

    return data
  }

  @Post('/logout')
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
  public async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<RefreshTokenResponse> {
    const { refresh_token } = this.getCookies(req)
    const data = await this.authService.refresh(refresh_token)

    res.cookie(this.ACCESS_TOKEN_COOKIE, data.access_token, {
      maxAge: this.ACCESS_EXPIRES,
      secure: true,
      sameSite: 'none'
    })

    return data
  }

  @Post('/verify/:link')
  public async verify(@Param('link') link: string, @Res({ passthrough: true }) res: Response): Promise<AuthResponse> {
    const data = await this.authService.verify(link)
    this.setCookies(res, data.refresh_token, data.access_token)
    return data
  }

  @Post('/welcome')
  @UseGuards(JwtAuthGuard)
  public async welcomePage(@Body() details: UserDetailsDto, @Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<AuthResponse> {
    const { access_token } = this.getCookies(req)

    const data = await this.authService.welcomePage(access_token, details)
    this.setCookies(res, data.refresh_token, data.access_token)
    return data
  }

  @Post('/resend-verification')
  @UseGuards(JwtAuthGuard)
  public async resendVerification(@GetUser() user: JwtPayload): Promise<void> {
    await this.authService.resendVerification(user)
  }

  @Post('/forgot')
  public async forgot(@Body() dto: ForgotDto): Promise<void> {
    await this.authService.forgot(dto.email)
  }

  @Post('/reset')
  public async reset(@Query('id') id: string, @Query('token') token: string, @Body() dto: ResetPasswordDto, @Res({ passthrough: true }) res: Response): Promise<AuthResponse> {
    const data = await this.authService.reset(id, token, dto)

    this.setCookies(res, data.refresh_token, data.access_token)

    return data
  }
}
