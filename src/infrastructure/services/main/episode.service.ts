import { Injectable } from '@nestjs/common'
import { QueryPaginationDto } from 'src/infrastructure/dto/common/pagination.dto'
import { CreateEpisodeDto, QueryEpisodeDto, UpdateEpisodeDto } from 'src/infrastructure/dto/main/episode.dto'
import { EpisodeRepository } from '../../repositories/main/episode.repository'
import { PaginationService } from '../common/pagination.service'
import { Episode } from '../../entities/main/episode.entity'
import { EpisodeAlreadyExistException, EpisodesNotFoundException, EpisodeWithIdNotFoundException } from 'src/domain/exceptions/main/episode.exception'

@Injectable()
export class EpisodeService {
  constructor(private readonly episodeRepository: EpisodeRepository, private readonly paginationService: PaginationService<Episode>) {}

  async createOne(createEpisodeDto: CreateEpisodeDto) {
    const exist = this.episodeRepository.findOneBy({ name: createEpisodeDto.name })
    if (exist) throw new EpisodeAlreadyExistException(createEpisodeDto.name)

    const episode = this.episodeRepository.create(createEpisodeDto)
    return await this.episodeRepository.save(episode)
  }

  async getMany(queryPaginationDto: QueryPaginationDto, queryEpisodeDto: QueryEpisodeDto) {
    const { episodes, count } = await this.episodeRepository.getMany(queryPaginationDto, queryEpisodeDto)

    if (!count) throw new EpisodesNotFoundException()

    const buildPaginationInfo = this.paginationService.buildPaginationInfo({ queryPaginationDto, count })
    return this.paginationService.wrapEntityWithPaginationInfo(episodes, buildPaginationInfo)
  }

  async getOne(id: number) {
    const episode = await this.episodeRepository.getOne(id)

    if (!episode) throw new EpisodeWithIdNotFoundException(id)

    return episode
  }

  async updateOne(id: number, updateEpisodeDto: Partial<UpdateEpisodeDto>) {
    const episode = await this.episodeRepository.getOne(id)

    if (!episode) throw new EpisodeWithIdNotFoundException(id)

    return await this.episodeRepository.updateOne(id, updateEpisodeDto)
  }

  async removeOne(id: number) {
    const episode = await this.episodeRepository.getOne(id)

    if (!episode) throw new EpisodeWithIdNotFoundException(id)

    return await this.episodeRepository.removeOne(id)
  }

  async getCount() {
    return await this.episodeRepository.getCount()
  }
}
