import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { TokenService } from '@services/common/token.service'
import { TokenRepository } from '@repositories/common/token.repository'
import { EnvironmentConfigModule } from '@config/environment-config.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Token } from '@entities/common/token.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Token]), JwtModule, EnvironmentConfigModule],
  providers: [TokenService, TokenRepository],
  exports: [TokenService]
})
export class TokenModule {}
