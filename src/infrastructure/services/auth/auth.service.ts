import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
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
import type { AuthTokens } from '@domain/models/auth/auth.model'
import type { Token } from '@entities/common/token.entity'
import { ResetPasswordDto, UserDetailsDto } from '@dto/common/user.dto'
import { UserBeforeAuthentication } from '@domain/models/common/user.model'

@Injectable()
export class AuthService {
  public constructor(
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
    if (dto.password != dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match')
    }
    const hashedPassword = await this.hashPassword(dto.password)
    const info: UserBeforeAuthentication = {
      email: dto.email,
      username: null,
      password: hashedPassword,
      auth_type: 'jwt',
      photo: null,
      is_verified: false
    }

    return this.tokenService.generateTempToken(info)
  }

  public async welcome(token: string, details: UserDetailsDto) {
    const verify = this.tokenService.validateTempToken(token)
    const verify_link = uuid()
    console.log(verify, ' <<<< PAYLOAD')
    const user = await this.userService.createOne({
      ...verify,
      username: details.username,
      country: details.country,
      mail_subscribe: details.mail_subscribe
    })
    if (!user.is_verified) {
      await this.userService.updateOne(user.id, { verify_link })
      await this.mailService.sendVerifyMail(user.email, `${this.config.getClientUrl()}/auth/verify/${verify_link}`)
    }

    return this.buildUserInfoAndTokens(user)
  }

  public async login(userDto: SignInDto): Promise<AuthTokens> {
    const user = await this.validateUser(userDto)

    return this.buildUserInfoAndTokens(user)
  }

  public async logout(refreshToken: string): Promise<Token> {
    return this.tokenService.removeByToken(refreshToken)
  }

  public async refresh(refreshToken: string): Promise<AuthTokens> {
    if (!refreshToken) {
      throw new UnauthorizedException()
    }

    const userData = this.tokenService.validateRefreshToken(refreshToken)
    const tokenFromDatabase = await this.tokenService.getOne(refreshToken)
    if (!userData || !tokenFromDatabase) {
      throw new UnauthorizedException()
    }
    const user = await this.userService.getOneById(userData.id)

    return this.buildUserInfoAndTokens(user)
  }

  public async verify(link: string): Promise<AuthTokens> {
    const user = await this.userService.getOneByVerifyLink(link)

    if (!user) {
      throw new BadRequestException('Incorrect verification link')
    }

    const updated = await this.userService.updateOne(user.id, { is_verified: true })
    return this.buildUserInfoAndTokens(updated)
  }

  public async forgot(email: string) {
    const user = await this.userService.getOneByAuthType(email, 'jwt')
    if (!user) {
      throw new UserDoesNotExistException()
    }
    const payload = {
      id: user.id,
      email: user.email,
      username: user.username
    }
    const token = this.tokenService.generateTempToken(payload)
    const link = `${this.config.getClientUrl()}/auth/reset/${user.id}/${token}`
    await this.mailService.sendForgotPasswordLink(user.email, link)

    return link
  }

  public async reset(id: string, token: string, dto: ResetPasswordDto): Promise<User> {
    const oldUser = await this.userService.getOneById(id)
    if (!oldUser) {
      throw new UserDoesNotExistException()
    }
    const compare = await this.comparePassword(dto.password, oldUser.password)
    if (compare) {
      throw new BadRequestException('Password is equal to old password')
    }
    this.tokenService.validateTempToken(token)
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match')
    }
    const hashedPassword = await this.hashPassword(dto.password)
    return this.userService.updateOne(id, { password: hashedPassword })
  }

  public async buildUserInfoAndTokens(user: any): Promise<AuthTokens> {
    const tokens = this.tokenService.generateTokens(user)
    await this.tokenService.saveToken(user.id, tokens.refresh_token)
    return tokens
  }

  private async validateUser(userDto: SignInDto): Promise<User> {
    const user = await this.userService.getOneByAuthType(userDto.email, 'jwt')
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
