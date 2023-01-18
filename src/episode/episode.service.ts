import { InjectRepository } from '@nestjs/typeorm'
import { Injectable, NotFoundException } from '@nestjs/common'
import { FindManyOptions, Repository } from 'typeorm'
import { CreateEpisodeDto } from './dto/create-episode.dto'
import { UpdateEpisodeDto } from './dto/update-episode.dto'
import { Episode } from './entities/episode.entity'
import { QueryEpisodeDto } from './dto/query-episode.dto'

@Injectable()
export class EpisodeService {
  private readonly relations: FindManyOptions<Episode> = {
    loadRelationIds: {
      relations: ['characters']
    },
    select: ['episode', 'airDate', 'createdAt', 'id', 'name']
  }

  constructor(@InjectRepository(Episode) private readonly episodeRepository: Repository<Episode>) {}

  async create(createEpisodeDto: CreateEpisodeDto) {
    const episode = await this.episodeRepository.create(createEpisodeDto)
    return await this.episodeRepository.save(episode)
  }

  async findAll(query?: QueryEpisodeDto) {
    // TODO: зробити фільтрацію
    const [episodes, count] = await this.episodeRepository.findAndCount({ ...this.relations, ...query })
    if (!episodes.length) {
      throw new NotFoundException(`Episodes not found`)
    }
    return { episodes, count }
  }

  async findOne(id: number) {
    const episode = await this.episodeRepository.findOne({
      ...this.relations,
      where: { id }
    })
    if (!episode) {
      throw new NotFoundException(`Episode with id ${id} not found`)
    }
    return episode
  }

  async update(id: number, updateEpisodeDto: Partial<UpdateEpisodeDto>) {
    // TODO: перевірити
    return await this.episodeRepository.update(id, updateEpisodeDto)
  }

  async remove(id: number | number[]) {
    // TODO: зробити видалення декількох одразу
    return await this.episodeRepository.delete(id)
  }
}
