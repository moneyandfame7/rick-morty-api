import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { EpisodeService } from '@app/services/main'
import { EpisodeController } from '@app/controllers/main'

import { Episode } from '@infrastructure/entities/main'
import { EpisodeRepository } from '@infrastructure/repositories/main'

import { EpisodeException } from '@common/exceptions/main'

import { ApiErrorModule, PaginationModule, TokenModule } from '@modules/common'

@Module({
  imports: [TypeOrmModule.forFeature([Episode]), TokenModule, PaginationModule, ApiErrorModule],
  controllers: [EpisodeController],
  providers: [EpisodeService, EpisodeRepository, EpisodeException]
})
export class EpisodeModule {}
