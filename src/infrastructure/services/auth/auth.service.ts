import { Injectable, UnauthorizedException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { UserService } from '../common/user.service'
import { TokenService } from '../common/token.service'
import { SignInDto, SignUpDto } from '../../dto/auth/auth.dto'
import { User } from '../../entities/common/user.entity'
import { UserWithEmailAlreadyExistsException, UserWithUsernameAlreadyExistsException } from '../../../domain/exceptions/common/user.exception'
import { AuthIncorrectEmailException, AuthIncorrectPasswordException } from '../../../domain/exceptions/common/auth.exception'

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly tokenService: TokenService) {}

  async signup(userDto: SignUpDto) {
    const withSameEmail = await this.userService.getOneByAuthType(userDto.email, 'jwt')
    if (withSameEmail) throw new UserWithEmailAlreadyExistsException(userDto.email)

    const withSameUsername = await this.userService.getOneByUsername(userDto.username)
    if (withSameUsername) throw new UserWithUsernameAlreadyExistsException(userDto.username)

    const hashedPassword = await this.hashPassword(userDto.password)
    const user = await this.userService.createOne({ ...userDto, password: hashedPassword, authType: 'jwt' })
    const tokens = await this.tokenService.generateTokens(user)

    await this.tokenService.saveToken(user.id, tokens.refresh_token)

    return {
      ...tokens,
      user: {
        ...user,
        password: undefined,
        roleId: undefined
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
        ...user,
        password: undefined
      }
    }
  }

  // todo: зробити buildUserInfo куди винести generateTokens, saveToken і return ...tokens, user
  async socialLogin(user: User) {
    const tokens = await this.tokenService.generateTokens(user)
    await this.tokenService.saveToken(user.id, tokens.refresh_token)
    return {
      ...tokens,
      user: {
        ...user,
        password: undefined
      }
    }
  }

  async logout(refreshToken: string) {
    return await this.tokenService.removeByToken(refreshToken)
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
        ...user,
        password: undefined
      }
    }
  }

  async validateUser(userDto: SignInDto) {
    const user = await this.userService.getOneByEmail(userDto.email)
    if (!user) throw new AuthIncorrectEmailException()

    const passwordEquals = await this.comparePassword(userDto.password, user.password)
    if (user && passwordEquals) return user

    if (!passwordEquals) throw new AuthIncorrectPasswordException()
  }

  private userInfoAndTokens() {}

  private async hashPassword(password: string) {
    return await bcrypt.hash(password, 3)
  }

  private async comparePassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash)
  }
}
