import { Injectable, UnauthorizedException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { v4 as uuid } from 'uuid'

import { EnvironmentConfigService, MailService, TokenService, UserService } from '@app/services/common'
import { LoginDto, SignupDto } from '@infrastructure/dto/authorization'
import { ResetPasswordDto, UserDetailsDto } from '@infrastructure/dto/common'

import { Token, User } from '@infrastructure/entities/common'

import type { UserBeforeAuthentication } from '@core/models/common'
import type { JwtPayload, RefreshTokenResponse } from '@core/models/authorization'
import { AuthResponse } from '@core/models/authorization'

import { AuthorizationException } from '@common/exceptions/authorization'
import { UserException } from '@common/exceptions/common'
import { AUTHORIZATION_PROVIDER } from '@common/constants'

@Injectable()
export class AuthorizationService {
  public constructor(
    private readonly config: EnvironmentConfigService,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService,
    private readonly authorizationException: AuthorizationException,
    private readonly userException: UserException
  ) {}

  public async signup(dto: SignupDto): Promise<AuthResponse> {
    const exists = await this.userService.getOneByAuthType(dto.email, AUTHORIZATION_PROVIDER.JWT)
    if (exists) {
      throw this.authorizationException.alreadyUsedEmail()
    }
    const hashedPassword = await this.hashPassword(dto.password)
    const verify_link = uuid()
    const info: UserBeforeAuthentication = {
      email: dto.email,
      password: hashedPassword,
      auth_type: AUTHORIZATION_PROVIDER.JWT,
      is_verified: false,
      verify_link
    }
    const user = await this.userService.createOne(info)
    await this.mailService.sendVerifyMail(user.email, verify_link)

    return this.buildUserInfoAndTokens(user)
  }

  public async welcomePage(initiator: JwtPayload, token: string, details: UserDetailsDto): Promise<AuthResponse> {
    const welcomePageUser = this.tokenService.validateAccessToken(token)

    const exist = await this.userService.getOneByUsername(details.username)
    if (exist && exist.id !== initiator.id) {
      throw this.userException.alreadyExistsWithUsername(details.username)
    }
    const user = await this.userService.updateOne(welcomePageUser.id, details)

    return this.buildUserInfoAndTokens(user)
  }

  public async login(userDto: LoginDto): Promise<AuthResponse> {
    const user = await this.validateUser(userDto)

    return this.buildUserInfoAndTokens(user)
  }

  public logout(refreshToken: string): Promise<Token> {
    return this.tokenService.removeByToken(refreshToken)
  }

  public async refresh(refreshToken: string): Promise<RefreshTokenResponse> {
    if (!refreshToken) {
      throw new UnauthorizedException('REFRESH TOKEN NOT PROVIDED')
    }

    const userData = this.tokenService.validateRefreshToken(refreshToken)
    const tokenFromDatabase = await this.tokenService.getOne(refreshToken)

    if (!userData || !tokenFromDatabase) {
      throw new UnauthorizedException('NOT FOUNDED USER OR IN DATABASE')
    }

    const user = await this.userService.getOneById(userData.id)

    return this.tokenService.generateAccessToken(user)
  }

  public async verify(link: string): Promise<AuthResponse> {
    const user = await this.userService.getOneByVerifyLink(link)

    if (!user) {
      throw this.authorizationException.incorrectVerificationLink()
    }
    if (user.is_verified) {
      throw this.authorizationException.alreadyVerified()
    }
    const updated = await this.userService.updateOne(user.id, { is_verified: true })

    return this.buildUserInfoAndTokens(updated)
  }

  public async resendVerification(user: JwtPayload): Promise<void> {
    const foundedUser = await this.userService.getOneById(user.id)

    if (!foundedUser) {
      throw this.authorizationException.incorrectVerificationLink()
    }

    if (foundedUser.is_verified) {
      throw this.authorizationException.alreadyVerified()
    }
    await this.mailService.sendVerifyMail(foundedUser.email, foundedUser.verify_link)
  }

  public async forgot(email: string): Promise<void> {
    const user = await this.userService.getOneByAuthType(email, AUTHORIZATION_PROVIDER.JWT)
    if (!user) {
      throw this.authorizationException.incorrectEmail()
    }
    const payload = {
      id: user.id,
      email: user.email,
      username: user.username
    }
    const token = this.tokenService.generateTempToken(payload)
    const link = `${this.config.getClientUrl()}/reset?id=${user.id}&token=${token}`
    await this.mailService.sendForgotPasswordLink(user.email, link)
  }

  public async reset(id: string, token: string, dto: ResetPasswordDto): Promise<AuthResponse> {
    const user = await this.userService.getOneById(id)

    if (!user) {
      throw this.userException.withIdNotFound()
    }
    const compare = await this.comparePassword(dto.password, user.password)
    if (compare) {
      throw this.authorizationException.passwordIsEqualToOld()
    }

    this.tokenService.validateTempToken(token)

    if (dto.password !== dto.confirmPassword) {
      throw this.authorizationException.passwordsDontMatch()
    }
    const hashedPassword = await this.hashPassword(dto.password)
    const updated = await this.userService.updateOne(id, { password: hashedPassword })

    return this.buildUserInfoAndTokens(updated)
  }

  public async buildUserInfoAndTokens(user: User): Promise<AuthResponse> {
    const data = this.tokenService.generateTokens(user)
    await this.tokenService.saveToken(user.id, data.refresh_token)
    return data
  }

  private async validateUser(userDto: LoginDto): Promise<User> {
    const user = await this.userService.getOneByAuthType(userDto.email, AUTHORIZATION_PROVIDER.JWT)
    if (!user) {
      throw this.authorizationException.incorrectEmail()
    }

    const passwordEquals = await this.comparePassword(userDto.password, user.password)
    if (!passwordEquals) {
      throw this.authorizationException.incorrectPassword()
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
