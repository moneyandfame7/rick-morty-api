import { Injectable, UnauthorizedException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { v4 as uuid } from 'uuid'

import { EnvironmentConfigService, MailService, TokenService, UserService } from '@app/services/common'
import { AuthorizationDto } from '@app/dto/authorization'
import { ResetPasswordDto, UserDetailsDto } from '@app/dto/common'

import { Token, User } from '@infrastructure/entities/common'

import type { UserBeforeAuthentication } from '@core/models/common'
import type { AuthorizationTokens, JwtPayload } from '@core/models/authorization'

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

  public async signup(dto: AuthorizationDto): Promise<AuthorizationTokens> {
    const exists = await this.userService.getOneByAuthType(dto.email, AUTHORIZATION_PROVIDER.JWT)
    if (exists) {
      throw this.authorizationException.alreadyUsedEmail(exists.email)
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
    // return {
    //   message: 'User is redirected to Welcome page',
    //   body: {
    //     user,
    //     tokens
    //   }
    // }
  }

  public async welcomePage(token: string, details: UserDetailsDto): Promise<AuthorizationTokens> {
    const welcomePageUser = this.tokenService.validateAccessToken(token)

    const user = await this.userService.updateOne(welcomePageUser.id, details)
    return this.buildUserInfoAndTokens(user)
    // return {
    //   message: 'User is redirected to Home page',
    //   body: {
    //     user,
    //     tokens
    //   }
    // }
  }

  public async login(userDto: AuthorizationDto): Promise<AuthorizationTokens> {
    const user = await this.validateUser(userDto)
    return this.buildUserInfoAndTokens(user)

    // if (!(user.username || user.country || user.mail_subscribe)) {
    //   return {
    //     message: 'User is redirected to Welcome page',
    //     body: {
    //       user,
    //       tokens
    //     }
    //   }
    // }
    //
    // return { message: 'User is redirected to Home page', body: { user, tokens } }
  }

  public logout(refreshToken: string): Promise<Token> {
    return this.tokenService.removeByToken(refreshToken)
  }

  public status(tokens: AuthorizationTokens): JwtPayload {
    return this.tokenService.validateAccessToken(tokens.access_token)
  }

  public async refresh(refreshToken: string): Promise<AuthorizationTokens> {
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

  public async verify(link: string): Promise<AuthorizationTokens> {
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

  public async forgot(email: string): Promise<string> {
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
    const link = `${this.config.getClientUrl()}/auth/reset/${user.id}/${token}`
    await this.mailService.sendForgotPasswordLink(user.email, link)

    return link
  }

  public async reset(id: string, token: string, dto: ResetPasswordDto): Promise<AuthorizationTokens> {
    const user = await this.userService.getOneById(id)

    if (!user) {
      throw this.userException.withIdNotFound(id)
    }
    const compare = await this.comparePassword(dto.password, user.password)
    if (compare) {
      throw this.authorizationException.passwordIsEqualToOld()
    }
    this.tokenService.validateTempToken(token)
    if (dto.password !== dto.confirmPassword) {
      throw this.authorizationException.passwordDontMatch()
    }
    const hashedPassword = await this.hashPassword(dto.password)
    const updated = await this.userService.updateOne(id, { password: hashedPassword })
    return this.buildUserInfoAndTokens(updated)
  }

  public async buildUserInfoAndTokens(user: User): Promise<AuthorizationTokens> {
    const tokens = await this.tokenService.generateTokens(user)
    await this.tokenService.saveToken(user.id, tokens.refresh_token)
    return tokens
  }

  private async validateUser(userDto: AuthorizationDto): Promise<User> {
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
