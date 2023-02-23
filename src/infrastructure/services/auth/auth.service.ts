import { EnvironmentConfigService } from '@config/environment-config.service'
import { AuthIncorrectEmailException, AuthIncorrectPasswordException } from '@domain/exceptions/common/auth.exception'
import { UserDoesNotExistException, UserWithEmailAlreadyExistsException } from '@domain/exceptions/common/user.exception'
import type { AuthTokens } from '@domain/models/auth/auth.model'
import { UserBeforeAuthentication } from '@domain/models/common/user.model'
import type { SignInDto } from '@dto/auth/auth.dto'
import { SignUpDto } from '@dto/auth/auth.dto'
import { ResetPasswordDto, UserDetailsDto } from '@dto/common/user.dto'
import type { User } from '@entities/common/user.entity'
import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common'
import { MailService } from '@services/common/mail.service'
import { TokenService } from '@services/common/token.service'
import { UserService } from '@services/common/user.service'
import * as bcrypt from 'bcrypt'
import { v4 as uuid } from 'uuid'

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
    const hashedPassword = await this.hashPassword(dto.password)
    const verify_link = uuid()
    const info: UserBeforeAuthentication = {
      email: dto.email,
      username: null,
      password: hashedPassword,
      auth_type: 'jwt',
      photo: null,
      is_verified: false,
      verify_link
    }
    const user = await this.userService.createOne(info)
    await this.mailService.sendVerifyMail(user.email, verify_link)

    const tokens = await this.buildUserInfoAndTokens(user)
    return {
      message: 'User is redirected to Welcome page',
      body: {
        user,
        tokens
      }
    }
  }

  // todo: на клієнті зробити функцію, яка перевіряє, якщо юзер авторизований, але не пройшов велкам пейдж - тоді редірект на велком пейдж
  // якщо не авторизований, то на /login
  public async welcome(token: string, details: UserDetailsDto) {
    const welcomePageUser = this.tokenService.validateAccessToken(token)

    const user = await this.userService.updateOne(welcomePageUser.id, details)
    const tokens = await this.buildUserInfoAndTokens(user)
    return {
      message: 'User is redirected to Home page',
      body: {
        user,
        tokens
      }
    }
  }

  public async login(userDto: SignInDto) {
    const user = await this.validateUser(userDto)
    const tokens = await this.buildUserInfoAndTokens(user)

    if (!(user.username || user.country || user.mail_subscribe)) {
      return {
        message: 'User is redirected to Welcome page',
        body: {
          user,
          tokens
        }
      }
    }

    return { message: 'User is redirected to Home page', body: { user, tokens } }
  }

  public async logout(refreshToken: string) {
    const removedToken = await this.tokenService.removeByToken(refreshToken)
    const user = await this.userService.getOneById(removedToken.user_id)
    return {
      message: 'User is logged out',
      body: {
        user
      }
    }
  }

  public async status(tokens: AuthTokens) {
    const user = await this.tokenService.validateAccessToken(tokens.access_token)
    if (user) {
      const ifPassedWelcomePage = user.country || user.username || user.mail_subscribe
      return {
        message: ifPassedWelcomePage ? 'User is finished registration' : 'User is redirected to welcome page',
        body: {
          user,
          tokens
        }
      }
    }
    throw new InternalServerErrorException('папєрєджіваю про памілку')
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
    if (user.is_verified) {
      throw new BadRequestException('User already verified')
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
    console.log(link)
    await this.mailService.sendForgotPasswordLink(user.email, link)

    return link
  }

  public async reset(id: string, token: string, dto: ResetPasswordDto): Promise<AuthTokens> {
    const user = await this.userService.getOneById(id)
    if (!user) {
      throw new UserDoesNotExistException()
    }
    const compare = await this.comparePassword(dto.password, user.password)
    if (compare) {
      throw new BadRequestException('Password is equal to old password')
    }
    this.tokenService.validateTempToken(token)
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match')
    }
    const hashedPassword = await this.hashPassword(dto.password)
    const updated = await this.userService.updateOne(id, { password: hashedPassword })
    return this.buildUserInfoAndTokens(updated)
  }

  public async buildUserInfoAndTokens(user: User): Promise<AuthTokens> {
    const tokens = await this.tokenService.generateTokens(user)
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
