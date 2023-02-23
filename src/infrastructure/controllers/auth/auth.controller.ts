import { JwtAuthGuard } from '@common/guards/auth/jwt.guard'
import { EnvironmentConfigService } from '@config/environment-config.service'
import type { AuthTokens } from '@domain/models/auth/auth.model'
import { SignInDto, SignUpDto } from '@dto/auth/auth.dto'
import { EmailDto, ResetPasswordDto, UserDetailsDto } from '@dto/common/user.dto'
import { Body, Controller, Get, Param, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AuthService } from '@services/auth/auth.service'
import { TokenService } from '@services/common/token.service'
import { UserService } from '@services/common/user.service'
import { Request, Response } from 'express'
import { BaseController } from 'src/domain/controllers/auth/base-controller.abstract'

// 1. Юзер проходить реєстрацію. Відправляється verify link на пошту.
// 2. Редірект на Welcome page. Заповнює інфу, в бд updateUser, і редірект на home page
// 3. Юзер виходить с сайту. Кукі видаляються, з бд теж видаляється токен.

// 1. Юзер проходить реєстрацію. Відправляється verify link на пошту.
// 2. Редірект на welcome page. Юзер не заповнює інфу а просто виходить з сайту. Токени
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
  public async signup(@Body() dto: SignUpDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const { access_token, refresh_token } = this.getCookies(req)
    if (access_token && refresh_token) {
      const user = this.tokenService.validateAccessToken(access_token)
      return {
        message: 'User already logged in, redirect to Home Page (or redirect to last in history page)',
        tokens: { access_token, refresh_token },
        user
      }
    }
    const data = await this.authService.signup(dto)
    this.setCookies(res, data.body.tokens.refresh_token, data.body.tokens.access_token)
    return data
  }

  @Post('/login')
  public async login(@Body() userDto: SignInDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const { access_token, refresh_token } = this.getCookies(req)
    if (access_token && refresh_token) {
      const user = this.tokenService.validateAccessToken(access_token)
      return {
        message: 'User already logged in, redirect to Home Page (or redirect to last in history page)',
        tokens: { access_token, refresh_token },
        user
      }
    }
    const data = await this.authService.login(userDto)
    this.setCookies(res, data.body.tokens.refresh_token, data.body.tokens.access_token)

    return data
  }

  @Post('/logout')
  @UseGuards(JwtAuthGuard)
  public async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
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
  public async verify(@Param('link') link: string, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.verify(link)
    this.setCookies(res, tokens.refresh_token, tokens.access_token)
    return {
      message: 'User is verified, redirect to home page',
      tokens
    }
  }

  @Get('/status')
  @UseGuards(JwtAuthGuard)
  public status(@Req() req: Request) {
    const tokens = this.getCookies(req)
    return this.authService.status(tokens)
  }

  // TODO: на клієнті робимо редірект, якщо юзер вже авторизований
  @Post('/welcome')
  @UseGuards(JwtAuthGuard)
  public async welcome(@Body() details: UserDetailsDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const { access_token } = this.getCookies(req)
    const data = await this.authService.welcome(access_token, details)

    this.setCookies(res, data.body.tokens.refresh_token, data.body.tokens.access_token)
    return data
  }

  @Post('/forgot')
  public async forgot(@Body() dto: EmailDto) {
    const link = this.authService.forgot(dto.email)
    return {
      message: 'The user should check the mail and follow the link to recover the password',
      body: link
    }
  }

  @Post('/reset/:id/:token')
  public async reset(@Param('id') id: string, @Param('token') token: string, @Body() dto: ResetPasswordDto, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.reset(id, token, dto)

    this.setCookies(res, tokens.refresh_token, tokens.access_token)

    return tokens
  }
}
