import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EpisodeModule } from './episode/episode.module'
import { CharacterModule } from './character/character.module'
import { LocationModule } from './location/location.module'
import { dataSourceOptions } from '../db/data-source'

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    CharacterModule,
    EpisodeModule,
    LocationModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
