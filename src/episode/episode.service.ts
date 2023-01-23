import { InjectRepository } from '@nestjs/typeorm'
import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateEpisodeDto } from './dto/create-episode.dto'
import { UpdateEpisodeDto } from './dto/update-episode.dto'
import { Episode } from './entities/episode.entity'
import { QueryEpisodeDto } from './dto/query-episode.dto'
import { PageOptionsDto } from 'src/shared/page-info/dto/page-options.dto'
import { PageDto } from 'src/shared/page-info/dto/page.dto'
import { PageInfoDto } from 'src/shared/page-info/dto/page-info.dto'
import { EpisodeRepository } from './episode.repository'

@Injectable()
export class EpisodeService {
  constructor(@InjectRepository(Episode) private readonly episodeRepository: EpisodeRepository) {}

  async create(createEpisodeDto: CreateEpisodeDto) {
    const exist = this.episodeRepository.findOneBy({ name: createEpisodeDto.name })
    if (exist) throw new BadRequestException('Episode already exist.')

    const episode = this.episodeRepository.create(createEpisodeDto)
    return await this.episodeRepository.save(episode)
  }

  async getMany(pageOptionsDto: PageOptionsDto, queryEpisodeDto: QueryEpisodeDto): Promise<PageDto<Episode>> {
    const { episodes, count } = await this.episodeRepository.getMany(pageOptionsDto, queryEpisodeDto)

    if (!count) throw new BadRequestException(`Episodes not found.`)

    const pageInfoDto = new PageInfoDto({ pageOptionsDto, count })
    return new PageDto(episodes, pageInfoDto)
  }

  async getOne(id: number) {
    const episode = await this.episodeRepository.getOne(id)

    if (!episode) throw new BadRequestException(`Episode with id ${id}  does not exist.`)

    return episode
  }

  async updateOne(id: number, updateEpisodeDto: Partial<UpdateEpisodeDto>) {
    const episode = await this.episodeRepository.getOne(id)

    if (!episode) throw new BadRequestException(`Episode with id ${id} does not exist.`)

    return await this.episodeRepository.updateOne(id, updateEpisodeDto)
  }

  async removeOne(id: number) {
    const episode = await this.episodeRepository.getOne(id)

    if (!episode) throw new BadRequestException(`Episode with id ${id} does not exist.`)

    return await this.episodeRepository.removeOne(id)
  }

  async getCount(): Promise<number> {
    return await this.episodeRepository.getCount()
  }
}
