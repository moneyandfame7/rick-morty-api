import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common'
import { Request, Response } from 'express'
import { AuthService } from '@services/auth/auth.service'
import { DiscordAuthGuard } from '@common/guards/auth/discord.guard'
import { EnvironmentConfigService } from '@config/environment-config.service'
import { BaseController } from 'src/domain/controllers/auth/base-controller.abstract'
import { UserService } from '@services/common/user.service'
import { CreateUserDto } from '@dto/common/user.dto'

@Controller('/auth/discord')
export class DiscordController extends BaseController {
  constructor(readonly config: EnvironmentConfigService, readonly authService: AuthService, readonly userService: UserService) {
    super(config, authService, userService)
  }

  @Get('/login')
  @UseGuards(DiscordAuthGuard)
  public async login(): Promise<void> {}

  @Get('/redirect')
  @UseGuards(DiscordAuthGuard)
  public async redirect(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = req.user as CreateUserDto
    const exist = await this.userService.getOneByAuthType(user.email, user.auth_type)
    // todo: зробити замість social login усюди this.authService.build ....
    const userData = await this.socialLogin(user)
    return {
      token: userData.access_token,
      user: exist ?? user,
      demo: exist ? 'Already exist' : 'First login'
    }
  }
}
