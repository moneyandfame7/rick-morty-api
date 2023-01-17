import { InjectRepository } from '@nestjs/typeorm'
import { Injectable, NotFoundException } from '@nestjs/common'
import { Repository, SelectQueryBuilder } from 'typeorm'
import { CreateEpisodeDto } from './dto/create-episode.dto'
import { UpdateEpisodeDto } from './dto/update-episode.dto'
import { Episode } from './entities/episode.entity'

@Injectable()
export class EpisodeService {
  private readonly queryBuilder: SelectQueryBuilder<Episode> = this.episodeRepository
    .createQueryBuilder('episode')
    .leftJoinAndSelect('episode.characters', 'characters')
    .select(['episode', 'episode.airDate', 'episode.createdAt'])
    .loadAllRelationIds()

  constructor(@InjectRepository(Episode) private readonly episodeRepository: Repository<Episode>) {}

  create(createEpisodeDto: CreateEpisodeDto) {
    const episode = this.episodeRepository.create(createEpisodeDto)
    return this.episodeRepository.save(episode)
  }

  findAll() {
    // TODO: зробити фільтрацію
    const episodes = this.queryBuilder.getMany()
    if (!episodes) {
      throw new NotFoundException(`Episodes not found`)
    }
    return episodes
  }

  async findOne(id: number) {
    const episode = await this.episodeRepository.findOne({
      relations: {
        characters: {}
      },
      select: ['episode', 'airDate', 'createdAt', 'id', 'name'],
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
