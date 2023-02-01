import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CreateUserDto } from '../user/dto/create-user.dto'
import { LocalGuard } from './strategies/local/local.guard'
import { AuthService } from './auth.service'

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalGuard)
  @Post('login')
  async login(@Request() req: any) {
    return this.authService.login(req.user)
  }

  @UseGuards(LocalGuard)
  @Post('local/sign-up')
  async signUp(@Body() userDto: CreateUserDto) {
    return await this.authService.signUp(userDto)
  }
}
