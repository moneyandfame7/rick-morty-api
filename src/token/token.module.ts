import { Module } from '@nestjs/common'
import { TokenService } from './token.service'
import { JwtModule } from '@nestjs/jwt'
import { TokenRepository } from './token.repository'

@Module({
  providers: [TokenService, TokenRepository],
  imports: [JwtModule.register({})],
  exports: [TokenService]
})
export class TokenModule {}
