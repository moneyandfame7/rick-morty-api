import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EpisodeModule } from './episode/episode.module'
import { CharacterModule } from './character/character.module'
import { LocationModule } from './location/location.module'
import { dataSourceOptions } from '../db/data-source'
import { S3Module } from './s3/s3.module'
import { ConfigModule } from '@nestjs/config'
import { UserModule } from './user/user.module'
import { RolesModule } from './roles/roles.module'
import { AuthModule } from './auth/auth.module'
import { TokenModule } from './token/token.module'
import { PassportModule } from '@nestjs/passport'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(dataSourceOptions),
    PassportModule,
    AuthModule,
    UserModule,
    TokenModule,
    RolesModule,
    S3Module,
    CharacterModule,
    EpisodeModule,
    LocationModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
