import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { TokenService } from './token.service'
import { TokenRepository } from './token.repository'

@Module({
  providers: [TokenService, TokenRepository],
  imports: [JwtModule],
  exports: [TokenService]
})
export class TokenModule {}
