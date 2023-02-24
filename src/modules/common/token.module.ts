import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'

import { TokenService } from '@app/services/common'

import { TokenRepository } from '@infrastructure/repositories/common'
import { Token } from '@infrastructure/entities/common'

import { EnvironmentConfigModule } from '@modules/common'

@Module({
  imports: [TypeOrmModule.forFeature([Token]), JwtModule, EnvironmentConfigModule],
  providers: [TokenService, TokenRepository],
  exports: [TokenService]
})
export class TokenModule {}
