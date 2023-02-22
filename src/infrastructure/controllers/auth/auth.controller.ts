import { Body, Controller, Get, Param, Post, Query, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Request, Response } from 'express'
import { JwtAuthGuard } from '@common/guards/auth/jwt.guard'
import { SignInDto, SignUpDto } from '@dto/auth/auth.dto'
import { BaseController } from 'src/domain/controllers/auth/base-controller.abstract'
import { EnvironmentConfigService } from '@config/environment-config.service'
import { AuthService } from '@services/auth/auth.service'
import { UserService } from '@services/common/user.service'
import { EmailDto, ResetPasswordDto, UserDetailsDto } from '@dto/common/user.dto'
import type { AuthTokens } from '@domain/models/auth/auth.model'
import type { Token } from '@entities/common/token.entity'
import { TokenService } from '@services/common/token.service'

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
  public async signup(@Body() dto: SignUpDto) {
    // TODO: робити на клієнті редірект на сторінку /welcome де задавати юзернейм і іншу інфу
    return this.authService.signup(dto)
  }

  @Post('/login')
  public async login(@Body() userDto: SignInDto): Promise<AuthTokens> {
    return this.authService.login(userDto)
    // this.setCookies(res, userData.refresh_token, userData.access_token)

    // return userData
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
  public async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<AuthTokens> {
    const { refresh_token } = this.getCookies(req)
    return this.authService.refresh(refresh_token)
    // this.setCookies(res, userData.refresh_token, userData.access_token)
    // return userData
  }

  @Post('/verify/:link')
  public async verify(@Param('link') link: string): Promise<AuthTokens> {
    return this.authService.verify(link)
    // this.setCookies(res, userData.refresh_token, userData.access_token)
  }

  @Get('/status')
  @UseGuards(JwtAuthGuard)
  public status(@Req() req: Request): AuthTokens {
    return this.getCookies(req)
  }

  // TODO: на клієнті робимо редірект, якщо юзер вже авторизований
  @Post('/welcome')
  public async welcome(@Query('token') token: string, @Body() details: UserDetailsDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.welcome(token, details)
  }

  @Post('/forgot')
  public async forgot(@Body() dto: EmailDto) {
    return this.authService.forgot(dto.email)
  }

  @Post('/reset/:id/:token')
  public async reset(@Param('id') id: string, @Param('token') token: string, @Body() dto: ResetPasswordDto, @Res({ passthrough: true }) res: Response) {
    const user = await this.authService.reset(id, token, dto)
    return this.authService.buildUserInfoAndTokens(user)
    // this.setCookies(res, userData.refresh_token, userData.access_token)

    // return userData
  }
}
