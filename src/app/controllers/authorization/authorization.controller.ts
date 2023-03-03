import { Body, Controller, Get, Param, Post, Redirect, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import type { Request, Response } from 'express'

import { AuthorizationService } from '@app/services/authorization'
import { EnvironmentConfigService, TokenService, UserService } from '@app/services/common'
import { EmailDto, ResetPasswordDto, UserDetailsDto } from '@app/dto/common'
import { AuthorizationDto } from '@app/dto/authorization'

import { Token } from '@infrastructure/entities/common'

import { BaseAuthorizationController } from '@core/controllers/authorization'
import type { AuthResponse, JwtPayload } from '@core/models/authorization'

import { JwtAuthGuard } from '@common/guards/authorization'

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
  public async signup(@Body() dto: AuthorizationDto, @Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<AuthResponse> {
    const data = await this.authService.signup(dto)
    this.setCookies(res, data.refresh_token, data.access_token)
    return data
  }

  @Post('/login')
  public async login(@Body() dto: AuthorizationDto, @Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<AuthResponse> {
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
  public async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<AuthResponse> {
    const { refresh_token } = this.getCookies(req)
    const data = await this.authService.refresh(refresh_token)
    this.setCookies(res, data.refresh_token, data.access_token)
    return data
  }

  @Post('/verify/:link')
  public async verify(@Param('link') link: string, @Res({ passthrough: true }) res: Response): Promise<AuthResponse> {
    const data = await this.authService.verify(link)
    this.setCookies(res, data.refresh_token, data.access_token)
    return data
  }

  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  public status(@Req() req: Request): JwtPayload {
    const tokens = this.getCookies(req)
    console.log(tokens)
    return this.authService.status(tokens)
  }

  @Post('/welcome')
  @Redirect('', 301)
  @UseGuards(JwtAuthGuard)
  public async welcomePage(@Body() details: UserDetailsDto, @Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<{ url: string }> {
    const { access_token } = this.getCookies(req)
    const tokens = await this.authService.welcomePage(access_token, details)
    this.setCookies(res, tokens.refresh_token, tokens.access_token)
    return { url: 'refresh' }
  }

  @Post('/forgot')
  public async forgot(@Body() dto: EmailDto): Promise<string> {
    return this.authService.forgot(dto.email)
  }

  @Post('/reset/:id/:token')
  public async reset(@Param('id') id: string, @Param('token') token: string, @Body() dto: ResetPasswordDto, @Res({ passthrough: true }) res: Response): Promise<AuthResponse> {
    const data = await this.authService.reset(id, token, dto)

    this.setCookies(res, data.refresh_token, data.access_token)

    return data
  }
}
