import { BadRequestException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { TokenRepository } from '@repositories/common/token.repository'
import { EnvironmentConfigService } from '@config/environment-config.service'
import type { User } from '@entities/common/user.entity'
import type { Token } from '@entities/common/token.entity'
import type { GeneratedTokens } from '@domain/models/common/token.model'
import { JwtPayload } from '@domain/models/auth/auth.model'

@Injectable()
export class TokenService {
  private readonly ACCESS_SECRET: string
  private readonly REFRESH_SECRET: string

  public constructor(private readonly tokenRepository: TokenRepository, private readonly jwtService: JwtService, private readonly config: EnvironmentConfigService) {
    this.ACCESS_SECRET = this.config.getJwtAccessSecret()
    this.REFRESH_SECRET = this.config.getJwtRefreshSecret()
  }

  public generateTokens(payload: JwtPayload): GeneratedTokens {
    const payloadD = { ...payload }
    const access_token = this.jwtService.sign(payloadD, {
      secret: this.ACCESS_SECRET,
      expiresIn: '25m'
    })
    const refresh_token = this.jwtService.sign(payloadD, {
      secret: this.REFRESH_SECRET,
      expiresIn: '30d'
    })

    return {
      access_token,
      refresh_token
    }
  }

  public generateTempToken(payload: any): string {
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

  public async getOneByUserId(id: string): Promise<Token | null> {
    return this.tokenRepository.getOneByUserId(id)
  }

  // public async getOneByUserAuthType(email: string, authType: string): Promise<Token | null> {
  //   const user = await this.userService.getOneByAuthType(email, authType)
  //   if (user) {
  //     return this.tokenRepository.getOneByUserId(user.id)
  //   }
  //   return null
  // }

  public validateAccessToken(token: string): User {
    try {
      return this.jwtService.verify(token, { secret: this.ACCESS_SECRET })
    } catch (e) {
      throw new BadRequestException('Invalid token')
    }
  }

  public validateRefreshToken(token: string): User {
    try {
      return this.jwtService.verify(token, { secret: this.REFRESH_SECRET })
    } catch (e) {
      throw new BadRequestException('Invalid token')
    }
  }

  public validateTempToken(token: string): JwtPayload {
    try {
      return this.jwtService.verify(token, { secret: this.ACCESS_SECRET })
    } catch (e) {
      throw new BadRequestException('Invalid token')
    }
  }
}
