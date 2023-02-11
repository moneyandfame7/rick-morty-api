import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { TokenModule } from '../token/token.module'
import { UserModule } from '../user/user.module'
import { JwtStrategy } from './strategies/jwt/jwt.strategy'
import { GoogleStrategy } from './strategies/google/google.strategy'
import { GithubStrategy } from './strategies/github/github.strategy'
import { DiscordStrategy } from './strategies/discord/discord.strategy'

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleStrategy, GithubStrategy, DiscordStrategy],
  imports: [JwtModule.register({ secret: process.env.AT_SECRET }), UserModule, PassportModule, TokenModule],
  exports: [AuthService, JwtModule]
})
export class AuthModule {}
