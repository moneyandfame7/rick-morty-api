import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common'
import { Request, Response } from 'express'
import { EnvironmentConfigService } from '@config/environment-config.service'
import { BaseController } from '@domain/controllers/auth/base-controller.abstract'
import { AuthService } from '@services/auth/auth.service'
import { GoogleAuthGuard } from '@common/guards/auth/google.guard'
import { UserService } from '@services/common/user.service'
import { CreateUserDto } from '@dto/common/user.dto'

@Controller('/auth/google')
export class GoogleController extends BaseController {
  public constructor(protected readonly config: EnvironmentConfigService, protected readonly authService: AuthService, protected readonly userService: UserService) {
    super(config, authService, userService)
  }

  @Get('/login')
  @UseGuards(GoogleAuthGuard)
  public async login(): Promise<void> {}

  @Get('/redirect')
  @UseGuards(GoogleAuthGuard)
  public async redirect(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = req.user as CreateUserDto
    const exist = await this.userService.getOneByAuthType(user.email, user.auth_type)
    const userData = await this.socialLogin(user)
    return {
      token: userData.access_token,
      user: exist ?? user,
      demo: exist ? 'Already exist' : 'First login'
    }
  }
}
