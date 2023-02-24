import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'

import { AuthController } from '@app/controllers/authorization'
import { AuthorizationService } from '@app/services/authorization'

import { AuthorizationException } from '@common/exceptions/authorization'
import { DiscordStrategy, GithubStrategy, GoogleStrategy, JwtStrategy, SpotifyStrategy } from '@common/strategies'

import { ApiErrorModule, EnvironmentConfigModule, MailModule, TokenModule, UserModule } from '@modules/common'

@Module({
  imports: [JwtModule.register({ secret: process.env.AT_SECRET }), EnvironmentConfigModule, UserModule, PassportModule, TokenModule, MailModule, ApiErrorModule],
  controllers: [AuthController],
  providers: [AuthorizationService, AuthorizationException, JwtStrategy, GoogleStrategy, GithubStrategy, DiscordStrategy, SpotifyStrategy],
  exports: [AuthorizationService, JwtModule]
})
export class AuthModule {}
