import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { CreateUserDto } from '../user/dto/create-user.dto'
import { UserService } from '../user/user.service'

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private jwtService: JwtService) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.getOneByEmail(email)

    return user && user.password === password ? user : null
  }

  async login(userDto: CreateUserDto) {
    const user = await this.userService.getOneByEmail(userDto.email)
    const payload = { id: user.id, email: user.email, password: user.password }

    return {
      access_token: this.jwtService.sign(payload)
    }
  }

  async signUp(userDto: CreateUserDto) {}
}
