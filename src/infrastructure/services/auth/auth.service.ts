import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { UserService } from '../common/user.service'
import { TokenService } from '../common/token.service'
import { SignInDto, SignUpDto } from '../../dto/auth/auth.dto'
import { User } from '../../entities/common/user.entity'
import { UserWithEmailAlreadyExistsException, UserWithUsernameAlreadyExistsException } from 'src/domain/exceptions/common/user.exception'
import { AuthIncorrectEmailException, AuthIncorrectPasswordException } from 'src/domain/exceptions/common/auth.exception'
import { MailService } from '../common/mail.service'
import { v4 as uuid } from 'uuid'
import { EnvironmentConfigService } from '../../config/environment-config.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly config: EnvironmentConfigService,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService
  ) {}

  async signup(userDto: SignUpDto) {
    const withSameEmail = await this.userService.getOneByAuthType(userDto.email, 'jwt')
    if (withSameEmail) throw new UserWithEmailAlreadyExistsException(userDto.email)

    const withSameUsername = await this.userService.getOneByUsername(userDto.username)
    if (withSameUsername) throw new UserWithUsernameAlreadyExistsException(userDto.username)

    const hashedPassword = await this.hashPassword(userDto.password)
    const verify_link = uuid()

    const user = await this.userService.createOne({ ...userDto, password: hashedPassword, auth_type: 'jwt', verify_link })
    await this.mailService.sendVerifyMail(user.email, `${this.config.getBaseUrl()}/auth/verify/${verify_link}`)
    return this.buildUserInfoAndTokens(user)
  }

  async login(userDto: SignInDto) {
    const user = await this.validateUser(userDto)

    return this.buildUserInfoAndTokens(user)
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

    return await this.buildUserInfoAndTokens(user)
  }

  public async verify(link: string) {
    const user = await this.userService.getOneByVerifyLink(link)

    if (!user) throw new BadRequestException('Incorrect verification link')

    user.is_verified = true
    await this.userService.save(user)
    return await this.buildUserInfoAndTokens(user)
  }

  public async buildUserInfoAndTokens(user: User) {
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

  private async validateUser(userDto: SignInDto) {
    const user = await this.userService.getOneByEmail(userDto.email)
    if (!user) throw new AuthIncorrectEmailException()

    const passwordEquals = await this.comparePassword(userDto.password, user.password)
    if (!passwordEquals) throw new AuthIncorrectPasswordException()

    return user
  }

  private async hashPassword(password: string) {
    return await bcrypt.hash(password, 3)
  }

  private async comparePassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash)
  }
}
