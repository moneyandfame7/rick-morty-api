import { BadRequestException, Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { v4 as uuid } from 'uuid'

import { EnvironmentConfigService, MailService, TokenService, UserService } from '@app/services/common'
import { AuthorizationDto } from '@app/dto/authorization'
import { ResetPasswordDto, UserDetailsDto } from '@app/dto/common'

import { Token, User } from '@infrastructure/entities/common'

import type { UserBeforeAuthentication } from '@core/models/common'
import { AuthorizationTokens, JwtPayload } from '@core/models/authorization'

import { UserNotFoundException } from '@common/exceptions/common'

@Injectable()
export class AuthorizationService {
  public constructor(
    private readonly config: EnvironmentConfigService,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService
  ) {}

  public async signup(dto: AuthorizationDto): Promise<AuthorizationTokens> {
    const errorResponse = {
      errors: {}
    }
    const withSameEmail = await this.userService.getOneByAuthType(dto.email, 'jwt')
    if (withSameEmail) {
      errorResponse.errors['email'] = 'the email address is already taken'
      throw new UnprocessableEntityException(errorResponse)
    }
    const hashedPassword = await this.hashPassword(dto.password)
    const verify_link = uuid()
    const info: UserBeforeAuthentication = {
      email: dto.email,
      password: hashedPassword,
      auth_type: 'jwt',
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
    const errorResponse = {
      errors: {}
    }
    const user = await this.userService.getOneByVerifyLink(link)

    if (!user) {
      errorResponse.errors['link'] = 'Incorrect verification link'
      throw new BadRequestException('Incorrect verification link')
    }
    if (user.is_verified) {
      throw new BadRequestException('User already verified')
    }
    const updated = await this.userService.updateOne(user.id, { is_verified: true })
    return this.buildUserInfoAndTokens(updated)
  }

  public async forgot(email: string): Promise<string> {
    const errorResponse = {
      errors: {}
    }
    const user = await this.userService.getOneByAuthType(email, 'jwt')
    if (!user) {
      errorResponse.errors['email'] = 'Incorrect email'
      throw new UserNotFoundException()
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
    const errorResponse = {
      errors: {}
    }
    const user = await this.userService.getOneById(id)

    if (!user) {
      throw new UserNotFoundException()
    }
    const compare = await this.comparePassword(dto.password, user.password)
    if (compare) {
      errorResponse.errors['password'] = 'Password is equal to old password'
      throw new BadRequestException(errorResponse)
    }
    this.tokenService.validateTempToken(token)
    if (dto.password !== dto.confirmPassword) {
      errorResponse.errors['password'] = "Password don't match"
      throw new BadRequestException(errorResponse)
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
    const errorResponse = {
      errors: {}
    }
    const user = await this.userService.getOneByAuthType(userDto.email, 'jwt')
    if (!user) {
      errorResponse.errors['email'] = 'Incorrect email'
      throw new UnprocessableEntityException(errorResponse)
    }

    const passwordEquals = await this.comparePassword(userDto.password, user.password)
    if (!passwordEquals) {
      errorResponse.errors['password'] = 'Incorrect password'
      throw new UnprocessableEntityException(errorResponse)
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
