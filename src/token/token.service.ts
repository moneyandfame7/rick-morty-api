import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from '../user/entities/user.entity'
import { ConfigService } from '@nestjs/config'
import { TokenRepository } from './token.repository'
import { UserAuthType } from '../auth/types/user-auth.type'

@Injectable()
export class TokenService {
  private readonly ACCESS_SECRET: string
  private readonly REFRESH_SECRET: string

  constructor(private tokenRepository: TokenRepository, private jwtService: JwtService, private configService: ConfigService) {
    this.ACCESS_SECRET = this.configService.get<string>('AT_SECRET')
    this.REFRESH_SECRET = this.configService.get<string>('RT_SECRET')
  }

  async generateTokens(user: User) {
    const payload = { id: user.id, email: user.email, role: user.role }

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.ACCESS_SECRET,
        expiresIn: '30m'
      }),
      this.jwtService.signAsync(payload, {
        secret: this.REFRESH_SECRET,
        expiresIn: '30d'
      })
    ])

    return {
      access_token,
      refresh_token
    }
  }

  async saveToken(user_id: string, refreshToken: string) {
    const tokenData = await this.tokenRepository.get(user_id)

    if (tokenData) {
      tokenData.refreshToken = refreshToken
      return await this.tokenRepository.save(tokenData)
    }

    const token = await this.tokenRepository.create({ user_id, refreshToken })
    return await this.tokenRepository.save(token)
  }

  async removeToken(refreshToken: string) {
    return await this.tokenRepository.deleteByToken(refreshToken)
  }

  async findToken(refreshToken: string) {
    return await this.tokenRepository.findByToken(refreshToken)
  }

  async validateAccessToken(token: string): Promise<UserAuthType> {
    try {
      return await this.jwtService.verifyAsync(token, { secret: this.ACCESS_SECRET })
    } catch (e) {
      console.log(e)
    }
  }

  async validateRefreshToken(token: string): Promise<UserAuthType> {
    return await this.jwtService.verifyAsync(token, { secret: this.REFRESH_SECRET })
  }
}
