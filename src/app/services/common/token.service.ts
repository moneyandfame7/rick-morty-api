import { BadRequestException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { TokenExpiredError } from 'jsonwebtoken'

import { EnvironmentConfigService } from '@app/services/common'

import { TokenRepository } from '@infrastructure/repositories/common'
import { Token, User } from '@infrastructure/entities/common'
import type { AuthResponse, JwtPayload, RefreshTokenResponse, TempJwtPayload } from '@core/models/authorization'
import { AuthorizationException } from '@common/exceptions/authorization'

@Injectable()
export class TokenService {
  private readonly ACCESS_SECRET: string
  private readonly REFRESH_SECRET: string
  private readonly ACCESS_EXPIRES: number
  private readonly REFRESH_EXPIRES: number

  public constructor(
    private readonly tokenRepository: TokenRepository,
    private readonly jwtService: JwtService,
    private readonly authorizationException: AuthorizationException,
    private readonly config: EnvironmentConfigService
  ) {
    this.ACCESS_SECRET = this.config.getJwtAccessSecret()
    this.REFRESH_SECRET = this.config.getJwtRefreshSecret()
    this.ACCESS_EXPIRES = this.config.getJwtAccessExpires() / 1000
    this.REFRESH_EXPIRES = this.config.getJwtRefreshExpires() / 1000
  }

  public generateTokens(user: User): AuthResponse {
    const payload = this.getPayload(user)

    const access_token = this.jwtService.sign(payload, {
      secret: this.ACCESS_SECRET,
      expiresIn: this.ACCESS_EXPIRES
    })
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.REFRESH_SECRET,
      expiresIn: this.REFRESH_EXPIRES
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
      expiresIn: '1m'
    })
  }

  public generateAccessToken(user: User): RefreshTokenResponse {
    const payload = this.getPayload(user)
    const access_token = this.jwtService.sign(payload, {
      secret: this.ACCESS_SECRET,
      expiresIn: this.ACCESS_EXPIRES
    })
    return {
      user: payload,
      access_token
    }
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
    return this.tokenRepository.removeByToken(refreshToken)
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

  public validateTempToken(token: string): void {
    try {
      this.jwtService.verify(token, { secret: this.ACCESS_SECRET })
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw this.authorizationException.tokenExpired()
      }
      throw this.authorizationException.invalidToken()
    }
  }

  private getPayload(user: User): JwtPayload {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      banned: user.banned,
      auth_type: user.auth_type,
      role: user.role,
      country: user.country,
      photo: user.photo,
      mail_subscribe: user.mail_subscribe,
      is_verified: user.is_verified
    }
  }
}
