import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { EpisodeService } from '@app/services/main/episode.service'
import { EpisodeController } from '@app/controllers/main/episode.controller'

import { Episode } from '@infrastructure/entities/main/episode.entity'
import { EpisodeRepository } from '@infrastructure/repositories/main/episode.repository'

import { EpisodeException } from '@common/exceptions/main/episode.exception'

import { TokenModule } from '@modules/common/token.module'
import { PaginationModule } from '@modules/common/pagination.module'
import { ApiErrorModule } from '@modules/common/api-error.module'

@Module({
  imports: [TypeOrmModule.forFeature([Episode]), TokenModule, PaginationModule, ApiErrorModule],
  controllers: [EpisodeController],
  providers: [EpisodeService, EpisodeRepository, EpisodeException]
})
export class EpisodeModule {}
