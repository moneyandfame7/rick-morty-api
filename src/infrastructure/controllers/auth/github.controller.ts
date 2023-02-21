import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common'
import { Request, Response } from 'express'
import { GithubAuthGuard } from '@common/guards/auth/github.guard'
import { EnvironmentConfigService } from '@config/environment-config.service'
import { AuthService } from '@services/auth/auth.service'
import { BaseController } from '@domain/controllers/auth/base-controller.abstract'
import { UserService } from '@services/common/user.service'
import { CreateUserDto } from '@dto/common/user.dto'

@Controller('/auth/github')
export class GithubController extends BaseController {
  constructor(readonly config: EnvironmentConfigService, readonly authService: AuthService, readonly userService: UserService) {
    super(config, authService, userService)
  }

  @Get('/login')
  @UseGuards(GithubAuthGuard)
  public async login(): Promise<void> {}

  @Get('/redirect')
  @UseGuards(GithubAuthGuard)
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
