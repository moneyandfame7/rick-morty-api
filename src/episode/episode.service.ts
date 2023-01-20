import { InjectRepository } from '@nestjs/typeorm'
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { Repository, SelectQueryBuilder } from 'typeorm'
import { CreateEpisodeDto } from './dto/create-episode.dto'
import { UpdateEpisodeDto } from './dto/update-episode.dto'
import { Episode } from './entities/episode.entity'
import { QueryEpisodeDto } from './dto/query-episode.dto'
import { PageOptionsDto } from 'src/shared/page-info/dto/page-options.dto'
import { PageDto } from 'src/shared/page-info/dto/page.dto'
import { PageInfoDto } from 'src/shared/page-info/dto/page-info.dto'

@Injectable()
export class EpisodeService {
  constructor(@InjectRepository(Episode) private readonly episodeRepository: Repository<Episode>) {}

  private get _builder() {
    return this.episodeRepository.createQueryBuilder('episode')
  }

  private _buildSearchFilters(builder: SelectQueryBuilder<Episode>, filters: QueryEpisodeDto) {
    filters.id ? builder.where('episode.id IN (:...id)', { id: filters.id }) : null

    filters.name ? builder.andWhere('episode.name ilike :name', { name: `%${filters.name}%` }) : null

    filters.episode ? builder.andWhere('episode.episode = :episode', { episode: filters.name }) : null

    filters.character_name ? builder.andWhere('characters.name = :character_name', { character_name: filters.character_name }) : null
  }

  private _buildRelations(builder: SelectQueryBuilder<Episode>) {
    builder.leftJoinAndSelect('episode.characters', 'characters').loadAllRelationIds()
  }

  async create(createEpisodeDto: CreateEpisodeDto) {
    const exist = this.episodeRepository.findOneBy({ name: createEpisodeDto.name })
    if (exist) throw new ConflictException('Episode already exist.')

    const episode = this.episodeRepository.create(createEpisodeDto)
    return await this.episodeRepository.save(episode)
  }

  async findAll(pageOptionsDto: PageOptionsDto, queryEpisode: QueryEpisodeDto): Promise<PageDto<Episode>> {
    const queryBuilder = this._builder.skip(pageOptionsDto.skip).take(pageOptionsDto.take).addOrderBy('episode.id', pageOptionsDto.order)
    this._buildRelations(queryBuilder)
    this._buildSearchFilters(queryBuilder, queryEpisode)

    const count = await queryBuilder.getCount()
    const episodes = await queryBuilder.getMany()

    if (!episodes.length) throw new NotFoundException(`Episodes not found.`)

    const pageInfoDto = new PageInfoDto({ pageOptionsDto, count })
    return new PageDto(episodes, pageInfoDto)
  }

  async findOne(id: number) {
    const queryBuilder = this._builder
    this._buildRelations(queryBuilder)

    const episode = await queryBuilder.where('episode.id = :id', { id }).getOne()
    if (!episode) throw new BadRequestException(`Episode with id ${id} does not exist.`)

    return episode
  }

  async update(id: number, updateEpisodeDto: Partial<UpdateEpisodeDto>) {
    return await this.episodeRepository.update(id, updateEpisodeDto)
  }

  async remove(id: number | number[]) {
    return await this.episodeRepository.delete(id)
  }
}
