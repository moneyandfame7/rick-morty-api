import { DataSource, SelectQueryBuilder } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { Episode } from '../../entities/main/episode.entity'
import { QueryPaginationDto } from 'src/infrastructure/dto/common/pagination.dto'
import { CreateEpisodeDto, QueryEpisodeDto, UpdateEpisodeDto } from 'src/infrastructure/dto/main/episode.dto'
import { BaseRepository } from 'src/domain/repositories/base-repository.abstract'
import { GetManyEpisodes } from 'src/domain/models/main/episode.model'

@Injectable()
export class EpisodeRepository extends BaseRepository<Episode, QueryEpisodeDto, CreateEpisodeDto, UpdateEpisodeDto, GetManyEpisodes> {
  constructor(protected dataSource: DataSource) {
    super(dataSource, 'episode', Episode)
  }

  protected buildQueries(builder: SelectQueryBuilder<Episode>, queries: QueryEpisodeDto) {
    queries.id ? builder.where('episode.id IN (:...id)', { id: queries.id }) : null

    queries.name ? builder.andWhere('episode.name ilike :name', { name: `%${queries.name}%` }) : null

    queries.episode ? builder.andWhere('episode.episode = :episode', { episode: queries.name }) : null

    queries.character_name ? builder.andWhere('characters.name = :character_name', { character_name: queries.character_name }) : null
  }

  protected buildRelations(builder: SelectQueryBuilder<Episode>) {
    builder.leftJoinAndSelect('episode.characters', 'characters').loadAllRelationIds({ relations: ['characters'] })
  }

  public async createOne(createEpisodeDto: CreateEpisodeDto) {
    const queryBuilder: SelectQueryBuilder<Episode> = this.builder
    const created = await queryBuilder.insert().into(Episode).values(createEpisodeDto).returning('*').execute()

    return created.raw[0]
  }

  public async getMany(pageOptionsDto: QueryPaginationDto, queryCharacterDto: QueryEpisodeDto): Promise<GetManyEpisodes> {
    const queryBuilder: SelectQueryBuilder<Episode> = this.builder.skip(pageOptionsDto.skip).take(pageOptionsDto.take).addOrderBy('episode.id', pageOptionsDto.order)

    this.buildQueries(queryBuilder, queryCharacterDto)
    this.buildRelations(queryBuilder)

    const [episodes, count] = await queryBuilder.getManyAndCount()
    return { episodes, count }
  }

  public async getOne(id: number): Promise<Episode> {
    const queryBuilder: SelectQueryBuilder<Episode> = this.builder
    this.buildRelations(queryBuilder)

    return await queryBuilder.where('episode.id = :id', { id }).getOne()
  }

  public async updateOne(id: number, updateEpisodeDto: UpdateEpisodeDto): Promise<Episode> {
    const queryBuilder: SelectQueryBuilder<Episode> = this.builder

    const updated = await queryBuilder.update(Episode).set(updateEpisodeDto).where('id = :id', { id }).returning('*').execute()

    return updated.raw[0]
  }

  public async removeOne(id: number): Promise<Episode> {
    const queryBuilder: SelectQueryBuilder<Episode> = this.builder

    const removed = await queryBuilder.delete().from(Episode).where('id = :id', { id }).returning('*').execute()

    return removed.raw[0]
  }
}
