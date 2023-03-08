import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport'
import { MailerModule } from '@nestjs-modules/mailer'
import { dataSourceOptions } from '../../database/data-source'

import { CharacterModule, EpisodeModule, LocationModule } from '@modules/main'
import { AuthModule, DiscordModule, GithubModule, GoogleModule, SpotifyModule } from '@modules/authorization'
import { ApiErrorModule, EnvironmentConfigModule, MailModule, RolesModule, S3Module, TokenModule, UserModule } from '@modules/common'
import { EnvironmentConfigService } from '@app/services/common'

const configs = [ConfigModule.forRoot({ isGlobal: true }), TypeOrmModule.forRoot(dataSourceOptions)]
const main = [CharacterModule, EpisodeModule, LocationModule]
const authorization = [AuthModule, DiscordModule, GithubModule, GoogleModule, SpotifyModule, PassportModule]
const commons = [ApiErrorModule, EnvironmentConfigModule, MailModule, RolesModule, S3Module, TokenModule, UserModule]

@Module({
  imports: [...configs, ...authorization, ...commons, ...main],
  controllers: [],
  providers: []
})
export class AppModule {}
