import { Injectable } from '@nestjs/common'
import type { QueryPaginationDto } from '@dto/common/pagination.dto'
import type { CreateEpisodeDto, QueryEpisodeDto, UpdateEpisodeDto } from '@dto/main/episode.dto'
import { EpisodeRepository } from '@repositories/main/episode.repository'
import { PaginationService, type Response } from '../common/pagination.service'
import type { Episode } from '@entities/main/episode.entity'
import { EpisodeException } from '@domain/exceptions/main/episode.exception'
import { BaseServiceAbstract } from '@domain/services/main/base-service.abstract'

@Injectable()
export class EpisodeService extends BaseServiceAbstract<Episode, CreateEpisodeDto, UpdateEpisodeDto, QueryEpisodeDto> {
  public constructor(
    private readonly episodeRepository: EpisodeRepository,
    private readonly paginationService: PaginationService<Episode>,
    private readonly episodesException: EpisodeException
  ) {
    super()
  }

  public async createOne(createEpisodeDto: CreateEpisodeDto): Promise<Episode> {
    const exists = await this.episodeRepository.findOneBy({ name: createEpisodeDto.name })
    if (exists) {
      throw this.episodesException.alreadyExists(exists.name)
    }

    const episode = this.episodeRepository.create(createEpisodeDto)
    return this.episodeRepository.save(episode)
  }

  public async getMany(queryPaginationDto: QueryPaginationDto, queryEpisodeDto: QueryEpisodeDto): Promise<Response<Episode>> {
    const { episodes, count } = await this.episodeRepository.getMany(queryPaginationDto, queryEpisodeDto)

    if (!count || !episodes) {
      throw this.episodesException.manyNotFound()
    }

    const buildPaginationInfo = this.paginationService.buildPaginationInfo({ queryPaginationDto, count })
    return this.paginationService.wrapEntityWithPaginationInfo(episodes, buildPaginationInfo)
  }

  public async getOne(id: number): Promise<Episode> {
    const episode = await this.episodeRepository.getOne(id)

    if (!episode) {
      throw this.episodesException.withIdNotFound(id)
    }

    return episode
  }

  public async updateOne(id: number, updateEpisodeDto: Partial<UpdateEpisodeDto>): Promise<Episode> {
    const episode = await this.episodeRepository.getOne(id)

    if (!episode) {
      throw this.episodesException.withIdNotFound(id)
    }

    return this.episodeRepository.updateOne(id, updateEpisodeDto)
  }

  public async removeOne(id: number): Promise<Episode> {
    const episode = await this.episodeRepository.getOne(id)

    if (!episode) {
      throw this.episodesException.withIdNotFound(id)
    }

    return this.episodeRepository.removeOne(id)
  }

  public async getCount(): Promise<number> {
    return this.episodeRepository.getCount()
  }
}
