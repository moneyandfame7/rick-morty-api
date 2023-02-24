import { Request, Response } from 'express'
import { Body, Controller, Get, Param, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '@common/guards/auth/jwt.guard'
import { EnvironmentConfigService } from '@config/environment-config.service'
import type { AuthTokens, JwtPayload } from '@domain/models/auth/auth.model'
import { AuthDto } from '@dto/auth/auth.dto'
import { EmailDto, ResetPasswordDto, UserDetailsDto } from '@dto/common/user.dto'
import { AuthService } from '@services/auth/auth.service'
import { TokenService } from '@services/common/token.service'
import { UserService } from '@services/common/user.service'
import { BaseController } from '@domain/controllers/auth/base-controller'
import { Token } from '@entities/common/token.entity'

@Controller('auth')
@ApiTags('auth')
export class AuthController extends BaseController {
  public constructor(
    protected readonly config: EnvironmentConfigService,
    protected readonly authService: AuthService,
    protected readonly userService: UserService,
    protected readonly tokenService: TokenService
  ) {
    super(config, authService, userService, tokenService)
  }

  @Post('/signup')
  public async signup(@Body() dto: AuthDto, @Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<AuthTokens> {
    const { access_token, refresh_token } = this.getCookies(req)
    if (access_token && refresh_token) {
      return {
        access_token,
        refresh_token
      }
    }
    const tokens = await this.authService.signup(dto)
    this.setCookies(res, tokens.refresh_token, tokens.access_token)
    return tokens
  }

  @Post('/login')
  public async login(@Body() dto: AuthDto, @Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<AuthTokens> {
    const { access_token, refresh_token } = this.getCookies(req)
    if (access_token && refresh_token) {
      return { access_token, refresh_token }
    }
    const tokens = await this.authService.login(dto)
    this.setCookies(res, tokens.refresh_token, tokens.access_token)

    return tokens
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
  public async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<AuthTokens> {
    const { refresh_token } = this.getCookies(req)
    const tokens = await this.authService.refresh(refresh_token)
    this.setCookies(res, tokens.refresh_token, tokens.access_token)
    return tokens
  }

  @Post('/verify/:link')
  public async verify(@Param('link') link: string, @Res({ passthrough: true }) res: Response): Promise<AuthTokens> {
    const tokens = await this.authService.verify(link)
    this.setCookies(res, tokens.refresh_token, tokens.access_token)
    return tokens
  }

  @Get('/status')
  @UseGuards(JwtAuthGuard)
  public status(@Req() req: Request): JwtPayload {
    const tokens = this.getCookies(req)
    return this.authService.status(tokens)
  }

  @Post('/welcome')
  @UseGuards(JwtAuthGuard)
  public async welcomePage(@Body() details: UserDetailsDto, @Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<AuthTokens> {
    const { access_token } = this.getCookies(req)
    const tokens = await this.authService.welcomePage(access_token, details)

    this.setCookies(res, tokens.refresh_token, tokens.access_token)
    return tokens
  }

  @Post('/forgot')
  public async forgot(@Body() dto: EmailDto): Promise<string> {
    return this.authService.forgot(dto.email)
  }

  @Post('/reset/:id/:token')
  public async reset(@Param('id') id: string, @Param('token') token: string, @Body() dto: ResetPasswordDto, @Res({ passthrough: true }) res: Response): Promise<AuthTokens> {
    const tokens = await this.authService.reset(id, token, dto)

    this.setCookies(res, tokens.refresh_token, tokens.access_token)

    return tokens
  }
}
