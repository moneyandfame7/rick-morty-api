import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EpisodeService } from './episode.service'
import { EpisodeController } from './episode.controller'
import { Episode } from './entities/episode.entity'
import { EpisodeRepository } from './episode.repository'

@Module({
  imports: [TypeOrmModule.forFeature([Episode])],
  controllers: [EpisodeController],
  providers: [EpisodeService, EpisodeRepository]
})
export class EpisodeModule {}
