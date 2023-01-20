import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EpisodeModule } from './episode/episode.module'
import { CharacterModule } from './character/character.module'
import { LocationModule } from './location/location.module'
import { dataSourceOptions } from '../db/data-source'
import { S3Module } from './s3/s3.module'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(dataSourceOptions),
    CharacterModule,
    EpisodeModule,
    LocationModule,
    S3Module
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
