import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { UserService } from '../user/user.service'
import { SignInDto } from './dto/sign-in.dto'
import { TokenService } from '../token/token.service'
import { SignUpDto } from './dto/sign-up.dto'

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly tokenService: TokenService) {}

  async signup(userDto: SignUpDto) {
    const candidate = await this.userService.getOneByEmail(userDto.email)
    if (candidate) throw new BadRequestException(`User with email ${userDto.email} already registered`)

    const hashedPassword = await this.hashPassword(userDto.password)
    const user = await this.userService.createOne({ ...userDto, password: hashedPassword, authType: 'jwt' })
    const tokens = await this.tokenService.generateTokens(user)

    await this.tokenService.saveToken(user.id, tokens.refresh_token)

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    }
  }

  async login(userDto: SignInDto) {
    const user = await this.validateUser(userDto)

    const tokens = await this.tokenService.generateTokens(user)
    await this.tokenService.saveToken(user.id, tokens.refresh_token)

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email
      }
    }
  }

  async logout(refreshToken: string) {
    return await this.tokenService.removeToken(refreshToken)
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) throw new UnauthorizedException()

    const userData = await this.tokenService.validateRefreshToken(refreshToken)
    const tokenFromDatabase = await this.tokenService.findToken(refreshToken)
    if (!userData || !tokenFromDatabase) throw new UnauthorizedException()
    const user = await this.userService.getOneById(userData.id)
    const tokens = await this.tokenService.generateTokens(user)
    await this.tokenService.saveToken(user.id, tokens.refresh_token)

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email
      }
    }
  }

  async googleLogout(data: Record<string, any>) {
    return 'Google logout'
    // return await this.sessionService.removeOneByData(JSON.stringify(data))
  }

  private async validateUser(userDto: SignInDto) {
    const user = await this.userService.getOneByEmail(userDto.email)
    if (!user) throw new UnauthorizedException('Invalid email.')

    const passwordEquals = await this.comparePassword(userDto.password, user.password)
    if (user && passwordEquals) return user

    if (!passwordEquals) throw new UnauthorizedException('Invalid password.')
  }

  private async hashPassword(password: string) {
    return await bcrypt.hash(password, 3)
  }

  private async comparePassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash)
  }
}
