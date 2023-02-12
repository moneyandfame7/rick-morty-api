import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PassportModule } from '@nestjs/passport'
import { ConfigModule } from '@nestjs/config'
import { EpisodeModule } from './infrastructure/modules/main/episode.module'
import { CharacterModule } from './infrastructure/modules/main/character.module'
import { LocationModule } from './infrastructure/modules/main/location.module'
import { dataSourceOptions } from '../db/data-source'
import { S3Module } from './infrastructure/modules/common/s3.module'
import { UserModule } from './infrastructure/modules/common/user.module'
import { RolesModule } from './infrastructure/modules/common/roles.module'
import { AuthModule } from './infrastructure/modules/auth/auth.module'
import { TokenModule } from './infrastructure/modules/common/token.module'
import { EnvironmentConfigModule } from './infrastructure/config/environment-config.module'
import { DiscordModule } from './infrastructure/modules/auth/discord.module'
import { GoogleModule } from './infrastructure/modules/auth/google.module'
import { SpotifyModule } from './infrastructure/modules/auth/spotify.module'
import { GithubModule } from './infrastructure/modules/auth/github.module'

const configs = [EnvironmentConfigModule, ConfigModule.forRoot({ isGlobal: true }), TypeOrmModule.forRoot(dataSourceOptions)]
const auth = [PassportModule, AuthModule, DiscordModule, GoogleModule, GithubModule, SpotifyModule]
const commons = [UserModule, TokenModule, RolesModule, S3Module]
const main = [CharacterModule, EpisodeModule, LocationModule]

@Module({
  imports: [...configs, ...auth, ...commons, ...main],
  controllers: [],
  providers: []
})
export class AppModule {}
