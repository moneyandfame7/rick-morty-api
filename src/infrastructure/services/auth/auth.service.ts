import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { v4 as uuid } from 'uuid'
import { UserService } from '@services/common/user.service'
import { TokenService } from '@services/common/token.service'
import { UserWithEmailAlreadyExistsException, UserWithUsernameAlreadyExistsException } from '@domain/exceptions/common/user.exception'
import { AuthIncorrectEmailException, AuthIncorrectPasswordException } from '@domain/exceptions/common/auth.exception'
import { MailService } from '@services/common/mail.service'
import { EnvironmentConfigService } from '@config/environment-config.service'
import type { SignInDto, SignUpDto } from '@dto/auth/auth.dto'
import type { User } from '@entities/common/user.entity'
import type { AuthTokensWithUser } from '@domain/models/auth/auth.model'
import type { Token } from '@entities/common/token.entity'

@Injectable()
export class AuthService {
  constructor(
    private readonly config: EnvironmentConfigService,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService
  ) {}

  public async signup(userDto: SignUpDto): Promise<AuthTokensWithUser> {
    const withSameEmail = await this.userService.getOneByAuthType(userDto.email, 'jwt')
    if (withSameEmail) throw new UserWithEmailAlreadyExistsException(userDto.email)

    const withSameUsername = await this.userService.getOneByUsername(userDto.username)
    if (withSameUsername) throw new UserWithUsernameAlreadyExistsException(userDto.username)

    const hashedPassword = await this.hashPassword(userDto.password)
    const verify_link = uuid()

    const user = await this.userService.createOne({
      ...userDto,
      password: hashedPassword,
      auth_type: 'jwt',
      verify_link
    })
    await this.mailService.sendVerifyMail(user.email, `${this.config.getBaseUrl()}/auth/verify/${verify_link}`)
    return this.buildUserInfoAndTokens(user)
  }

  public async login(userDto: SignInDto): Promise<AuthTokensWithUser> {
    const user = await this.validateUser(userDto)

    return this.buildUserInfoAndTokens(user)
  }

  public async logout(refreshToken: string): Promise<Token> {
    return this.tokenService.removeByToken(refreshToken)
  }

  public async refresh(refreshToken: string): Promise<AuthTokensWithUser> {
    if (!refreshToken) {
      throw new UnauthorizedException()
    }

    const userData = this.tokenService.validateRefreshToken(refreshToken)
    const tokenFromDatabase = await this.tokenService.findToken(refreshToken)
    if (!userData || !tokenFromDatabase) {
      throw new UnauthorizedException()
    }
    const user = await this.userService.getOneById(userData.id)

    return this.buildUserInfoAndTokens(user)
  }

  public async verify(link: string): Promise<AuthTokensWithUser> {
    const user = await this.userService.getOneByVerifyLink(link)

    if (!user) {
      throw new BadRequestException('Incorrect verification link')
    }

    user.is_verified = true
    await this.userService.save(user)
    return this.buildUserInfoAndTokens(user)
  }

  public async buildUserInfoAndTokens(user: User): Promise<AuthTokensWithUser> {
    const tokens = this.tokenService.generateTokens(user)
    await this.tokenService.saveToken(user.id, tokens.refresh_token)
    return {
      ...tokens,
      user
    }
  }

  private async validateUser(userDto: SignInDto): Promise<User> {
    const user = await this.userService.getOneByEmail(userDto.email)
    if (!user) throw new AuthIncorrectEmailException()

    const passwordEquals = await this.comparePassword(userDto.password, user.password)
    if (!passwordEquals) {
      throw new AuthIncorrectPasswordException()
    }

    return user
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 3)
  }

  private async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }
}
