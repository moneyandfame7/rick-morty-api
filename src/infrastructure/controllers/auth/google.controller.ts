import { Controller, Get, Req, UseGuards } from '@nestjs/common'
import { Request } from 'express'
import { EnvironmentConfigService } from '@config/environment-config.service'
import { BaseController } from '@domain/controllers/auth/base-controller.abstract'
import { AuthService } from '@services/auth/auth.service'
import { GoogleAuthGuard } from '@common/guards/auth/google.guard'
import { UserService } from '@services/common/user.service'
import { TokenService } from '@services/common/token.service'
import { UserBeforeAuthentication } from '@domain/models/common/user.model'

@Controller('/auth/google')
export class GoogleController extends BaseController {
  public constructor(
    protected readonly config: EnvironmentConfigService,
    protected readonly authService: AuthService,
    protected readonly userService: UserService,
    protected readonly tokenService: TokenService
  ) {
    super(config, authService, userService, tokenService)
  }

  @Get('/login')
  @UseGuards(GoogleAuthGuard)
  public async login(): Promise<void> {}

  @Get('/redirect')
  @UseGuards(GoogleAuthGuard)
  public redirect(@Req() req: Request) {
    const user = req.user as UserBeforeAuthentication
    return this.socialLogin(user)
  }
}
