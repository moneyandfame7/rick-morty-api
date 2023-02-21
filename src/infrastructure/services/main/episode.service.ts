import { Injectable } from '@nestjs/common'
import type { QueryPaginationDto } from 'src/infrastructure/dto/common/pagination.dto'
import type { CreateEpisodeDto, QueryEpisodeDto, UpdateEpisodeDto } from 'src/infrastructure/dto/main/episode.dto'
import { EpisodeRepository } from '../../repositories/main/episode.repository'
import { PaginationService, type Payload } from '../common/pagination.service'
import type { Episode } from '../../entities/main/episode.entity'
import { EpisodeAlreadyExistException, EpisodesNotFoundException, EpisodeWithIdNotFoundException } from 'src/domain/exceptions/main/episode.exception'

@Injectable()
export class EpisodeService {
  constructor(private readonly episodeRepository: EpisodeRepository, private readonly paginationService: PaginationService<Episode>) {}

  async createOne(createEpisodeDto: CreateEpisodeDto): Promise<Episode> {
    const exist = await this.episodeRepository.findOneBy({ name: createEpisodeDto.name })
    if (exist) throw new EpisodeAlreadyExistException(createEpisodeDto.name)

    const episode = this.episodeRepository.create(createEpisodeDto)
    return this.episodeRepository.save(episode)
  }

  async getMany(queryPaginationDto: QueryPaginationDto, queryEpisodeDto: QueryEpisodeDto): Promise<Payload<Episode>> {
    const { episodes, count } = await this.episodeRepository.getMany(queryPaginationDto, queryEpisodeDto)

    if (!count || !episodes) throw new EpisodesNotFoundException()

    const buildPaginationInfo = this.paginationService.buildPaginationInfo({ queryPaginationDto, count })
    return this.paginationService.wrapEntityWithPaginationInfo(episodes, buildPaginationInfo)
  }

  async getOne(id: number): Promise<Episode> {
    const episode = await this.episodeRepository.getOne(id)

    if (!episode) throw new EpisodeWithIdNotFoundException(id)

    return episode
  }

  async updateOne(id: number, updateEpisodeDto: Partial<UpdateEpisodeDto>): Promise<Episode> {
    const episode = await this.episodeRepository.getOne(id)

    if (!episode) throw new EpisodeWithIdNotFoundException(id)

    return this.episodeRepository.updateOne(id, updateEpisodeDto)
  }

  async removeOne(id: number): Promise<Episode> {
    const episode = await this.episodeRepository.getOne(id)

    if (!episode) throw new EpisodeWithIdNotFoundException(id)

    return this.episodeRepository.removeOne(id)
  }

  async getCount(): Promise<number> {
    return this.episodeRepository.getCount()
  }
}
