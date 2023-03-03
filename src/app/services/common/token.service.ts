import { BadRequestException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { EnvironmentConfigService } from '@app/services/common'

import { TokenRepository } from '@infrastructure/repositories/common'
import { Token, User } from '@infrastructure/entities/common'
import type { AuthResponse, JwtPayload, TempJwtPayload } from '@core/models/authorization'

@Injectable()
export class TokenService {
  private readonly ACCESS_SECRET: string
  private readonly REFRESH_SECRET: string

  public constructor(private readonly tokenRepository: TokenRepository, private readonly jwtService: JwtService, private readonly config: EnvironmentConfigService) {
    this.ACCESS_SECRET = this.config.getJwtAccessSecret()
    this.REFRESH_SECRET = this.config.getJwtRefreshSecret()
  }

  public generateTokens(user: User): AuthResponse {
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      username: user.username,
      banned: user.banned,
      auth_type: user.auth_type,
      role: user.role,
      country: user.country,
      photo: user.photo,
      mail_subscribe: user.mail_subscribe
    }
    const access_token = this.jwtService.sign(payload, {
      secret: this.ACCESS_SECRET,
      expiresIn: '30m'
    })
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.REFRESH_SECRET,
      expiresIn: '30d'
    })

    return {
      user: payload,
      access_token,
      refresh_token
    }
  }

  public generateTempToken(payload: TempJwtPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.ACCESS_SECRET,
      expiresIn: '10m'
    })
  }

  public async saveToken(user_id: string, refresh_token: string): Promise<Token> {
    const tokenData = await this.tokenRepository.get(user_id)

    if (tokenData) {
      tokenData.refresh_token = refresh_token
      return this.tokenRepository.save(tokenData)
    }

    const token = this.tokenRepository.create({ user_id, refresh_token })
    return this.tokenRepository.save(token)
  }

  public async removeByToken(refreshToken: string): Promise<Token> {
    return this.tokenRepository.deleteByToken(refreshToken)
  }

  public async removeByUserId(user_id: string): Promise<void> {
    await this.tokenRepository.delete({ user_id })
  }

  public async getOne(refreshToken: string): Promise<Token | null> {
    return this.tokenRepository.findByToken(refreshToken)
  }

  public async getOneByUserId(user_id: string): Promise<Token | null> {
    return this.tokenRepository.getOneByUserId(user_id)
  }
  public validateAccessToken(token: string): JwtPayload {
    try {
      return this.jwtService.verify(token, { secret: this.ACCESS_SECRET })
    } catch (e) {
      throw new BadRequestException('Invalid token')
    }
  }

  public validateRefreshToken(token: string): JwtPayload {
    try {
      return this.jwtService.verify(token, { secret: this.REFRESH_SECRET })
    } catch (e) {
      throw new BadRequestException('Invalid token')
    }
  }

  public validateTempToken(token: string): TempJwtPayload {
    try {
      return this.jwtService.verify(token, { secret: this.ACCESS_SECRET })
    } catch (e) {
      throw new BadRequestException('Invalid token')
    }
  }
}
