import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from '../user/entities/user.entity'
import { ConfigService } from '@nestjs/config'
import { TokenRepository } from './token.repository'

@Injectable()
export class TokenService {
  constructor(private tokenRepository: TokenRepository, private jwtService: JwtService, private configService: ConfigService) {}

  async generateTokens(user: User) {
    const payload = { id: user.id, email: user.email }

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.sign(payload, {
        secret: this.configService.get<string>('AT_SECRET'),
        expiresIn: '25m'
      }),
      this.jwtService.sign(payload, {
        secret: this.configService.get<string>('RT_SECRET'),
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
}
