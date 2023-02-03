import { Body, Controller, Post, Req, Res } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Request, Response } from 'express'
import { CreateUserDto } from '../user/dto/create-user.dto'
import { AuthService } from './auth.service'
import { SignInDto } from './dto/sign-in.dto'

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signup(@Body() userDto: CreateUserDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return await this.authService.signup(userDto, req, res)
  }

  @Post('/signin')
  async signin(@Body() userData: SignInDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return await this.authService.signin(userData, req, res)
  }
}
