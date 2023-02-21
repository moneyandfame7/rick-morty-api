import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { v4 as uuid } from 'uuid'
import { UserService } from '@services/common/user.service'
import { TokenService } from '@services/common/token.service'
import { UserDoesNotExistException, UserWithEmailAlreadyExistsException } from '@domain/exceptions/common/user.exception'
import { AuthIncorrectEmailException, AuthIncorrectPasswordException } from '@domain/exceptions/common/auth.exception'
import { MailService } from '@services/common/mail.service'
import { EnvironmentConfigService } from '@config/environment-config.service'
import type { SignInDto } from '@dto/auth/auth.dto'
import { SignUpDto } from '@dto/auth/auth.dto'
import type { User } from '@entities/common/user.entity'
import type { AuthTokensWithUser } from '@domain/models/auth/auth.model'
import type { Token } from '@entities/common/token.entity'
import { UserDetailsDto } from '@dto/common/user.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly config: EnvironmentConfigService,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService
  ) {}

  public async signup(dto: SignUpDto) {
    const withSameEmail = await this.userService.getOneByAuthType(dto.email, 'jwt')
    if (withSameEmail) {
      throw new UserWithEmailAlreadyExistsException(dto.email)
    }

    const hashedPassword = await this.hashPassword(dto.password)
    const verify_link = uuid()
    const info = {
      email: dto.email,
      password: hashedPassword,
      username: null,
      contry: null,
      mail_subscribe: true,
      verify_link,
      auth_type: 'jwt',
      is_verified: false
    }

    await this.mailService.sendVerifyMail(info.email, `${this.config.getClientUrl()}/auth/verify/${verify_link}`)

    return this.buildUserInfoAndTokens(info)
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

  public async welcome(token: string, details: UserDetailsDto) {
    const verify = this.tokenService.validateAccessToken(token)
    console.log(verify, ' <<<< VERIFY')
    const user = await this.userService.createOne({
      ...verify,
      username: details.username,
      country: details.country,
      mail_subscribe: details.mail_subscribe
    })
    console.log(user, ' <<<< USER')

    return this.buildUserInfoAndTokens(user)
  }

  public async forgot(email: string) {
    const user = await this.userService.getOneByAuthType(email, 'jwt')
    if (!user) {
      throw new UserDoesNotExistException()
    }
    const secret = this.config.getJwtAccessSecret() + user.password
    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role
    }
    const token = this.tokenService.generateTempToken(payload, secret)
    const link = `${this.config.getClientUrl()}/auth/reset/${user.id}/${token}`
    await this.mailService.sendForgotPasswordLink(user.email, link)

    return link
  }

  public async reset(id: string, token: string, password: string): Promise<User> {
    const oldUser = await this.userService.getOneById(id)
    if (!oldUser) {
      throw new UserDoesNotExistException()
    }
    const compare = await this.comparePassword(password, oldUser.password)
    if (compare) {
      throw new BadRequestException('Password is equal to old password')
    }
    const secret = this.config.getJwtAccessSecret() + oldUser.password
    try {
      this.tokenService.validateTempToken(token, secret)
    } catch (e) {
      throw new InternalServerErrorException('Invalid token')
    }
    const hashedPassword = await this.hashPassword(password)
    return this.userService.updateOne(id, { password: hashedPassword })
  }

  public async buildUserInfoAndTokens(user: any): Promise<AuthTokensWithUser> {
    const payload = user
    const tokens = this.tokenService.generateTokens(payload)
    await this.tokenService.saveToken(user.id, tokens.refresh_token)
    return {
      ...tokens,
      payload
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
