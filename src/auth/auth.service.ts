import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcrypt'
import { CreateUserDto } from '../user/dto/create-user.dto'
import { UserService } from '../user/user.service'
import { User } from '../user/entities/user.entity'
import { SignInDto } from './dto/sign-in.dto'
import { Request, Response } from 'express'

@Injectable()
export class AuthService {
  private readonly ACCESS_SECRET: string
  private readonly REFRESH_SECRET: string

  constructor(private readonly userService: UserService, private jwtService: JwtService, private configService: ConfigService) {
    this.ACCESS_SECRET = this.configService.get('AT_SECRET')
    this.REFRESH_SECRET = this.configService.get('RT_SECRET')
  }

  async signup(userDto: CreateUserDto, req: Request, res: Response) {
    const candidate = await this.userService.getOneByEmail(userDto.email)
    if (candidate) throw new BadRequestException(`User with email ${userDto.email} already registered`)

    const hashedPassword = await this.hashPassword(userDto.password)
    const user = await this.userService.createOne({ ...userDto, password: hashedPassword })
    const token = await this.generateToken(user)
    res.cookie('refresh-token', token.refresh_token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 })

    return token
  }

  async signin(userData: SignInDto, req: Request, res: Response) {
    const user = await this.validateUser(userData)
    return this.generateToken(user)
  }

  async signout(req, res) {}

  private async generateToken(user: User) {
    const payload = { id: user.id, email: user.email, role: { id: user.role.id, value: user.role.value } }

    const [at, rt] = await Promise.all([
      this.jwtService.sign(payload, {
        secret: this.ACCESS_SECRET,
        expiresIn: '25m'
      }),
      this.jwtService.sign(payload, {
        secret: this.REFRESH_SECRET,
        expiresIn: '30d'
      })
    ])

    return {
      access_token: at,
      refresh_token: rt
    }
  }

  private async validateUser(userDto: Omit<CreateUserDto, 'username'>) {
    const user = await this.userService.getOneByEmail(userDto.email)
    if (!user) throw new UnauthorizedException('Invalid email.')

    const passwordEquals = await this.comparePassword(userDto.password, user.password)
    if (user && passwordEquals) return user

    if (!passwordEquals) throw new UnauthorizedException('Invalid password.')
  }

  private async hashPassword(password: string) {
    return await bcrypt.hash(password, 10)
  }

  private async comparePassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash)
  }
}
