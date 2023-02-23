import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PassportModule } from '@nestjs/passport'
import { ConfigModule } from '@nestjs/config'
import { dataSourceOptions } from '../db/data-source'
import { EpisodeModule } from '@modules/main/episode.module'
import { CharacterModule } from '@modules/main/character.module'
import { LocationModule } from '@modules/main/location.module'
import { S3Module } from '@modules/common/s3.module'
import { UserModule } from '@modules/common/user.module'
import { RolesModule } from '@modules/common/roles.module'
import { AuthModule } from '@modules/auth/auth.module'
import { TokenModule } from '@modules/common/token.module'
import { EnvironmentConfigModule } from '@config/environment-config.module'
import { DiscordModule } from '@modules/auth/discord.module'
import { GoogleModule } from '@modules/auth/google.module'
import { SpotifyModule } from '@modules/auth/spotify.module'
import { GithubModule } from '@modules/auth/github.module'
import { MailModule } from '@modules/common/mail.module'

const configs = [EnvironmentConfigModule, ConfigModule.forRoot({ isGlobal: true }), TypeOrmModule.forRoot(dataSourceOptions)]
const auth = [PassportModule, AuthModule, DiscordModule, GoogleModule, GithubModule, SpotifyModule]
const commons = [UserModule, TokenModule, RolesModule, S3Module, MailModule]
const main = [CharacterModule, EpisodeModule, LocationModule]

@Module({
  imports: [...configs, ...auth, ...commons, ...main],
  controllers: [],
  providers: []
})
export class AppModule {}
