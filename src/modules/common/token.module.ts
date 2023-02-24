import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'

import { TokenService } from '@app/services/common/token.service'

import { TokenRepository } from '@infrastructure/repositories/common/token.repository'
import { Token } from '@infrastructure/entities/common/token.entity'

import { EnvironmentConfigModule } from '@modules/common/environment-config.module'

@Module({
  imports: [TypeOrmModule.forFeature([Token]), JwtModule, EnvironmentConfigModule],
  providers: [TokenService, TokenRepository],
  exports: [TokenService]
})
export class TokenModule {}
