import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EpisodeService } from '../../services/main/episode.service'
import { EpisodeController } from '../../controllers/main/episode.controller'
import { Episode } from '../../entities/main/episode.entity'
import { EpisodeRepository } from '../../repositories/main/episode.repository'
import { TokenModule } from '../common/token.module'
import { PaginationModule } from '../common/pagination.module'

@Module({
  imports: [TypeOrmModule.forFeature([Episode]), TokenModule, PaginationModule],
  controllers: [EpisodeController],
  providers: [EpisodeService, EpisodeRepository]
})
export class EpisodeModule {}
