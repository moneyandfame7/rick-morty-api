import { DataSource, type SelectQueryBuilder } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { Episode } from '@entities/main/episode.entity'
import type { QueryPaginationDto } from '@dto/common/pagination.dto'
import type { CreateEpisodeDto, QueryEpisodeDto, UpdateEpisodeDto } from '@dto/main/episode.dto'
import { BaseRepository } from '@domain/repositories/base-repository.abstract'
import type { GetManyEpisodes } from '@domain/models/main/episode.model'

@Injectable()
export class EpisodeRepository extends BaseRepository<Episode, QueryEpisodeDto, CreateEpisodeDto, UpdateEpisodeDto, GetManyEpisodes> {
  public constructor(protected dataSource: DataSource) {
    super(dataSource, 'episode', Episode)
  }

  protected buildQueries(builder: SelectQueryBuilder<Episode>, queries: QueryEpisodeDto): void {
    if (queries.id) {
      const ids = this.toCorrectQuerieIds(queries.id)

      queries.id ? builder.where('episode.id IN (:...ids)', { ids }) : null
    }

    queries.name ? builder.andWhere('episode.name ilike :name', { name: `%${queries.name}%` }) : null

    queries.episode ? builder.andWhere('episode.episode = :episode', { episode: queries.name }) : null

    queries.character_name ? builder.andWhere('characters.name = :character_name', { character_name: queries.character_name }) : null
  }

  protected buildRelations(builder: SelectQueryBuilder<Episode>): void {
    builder.leftJoinAndSelect('episode.characters', 'characters').loadAllRelationIds({ relations: ['characters'] })
  }

  public async createOne(createEpisodeDto: CreateEpisodeDto): Promise<Episode> {
    const queryBuilder = this.builder
    const created = await queryBuilder.insert().into(Episode).values(createEpisodeDto).returning('*').execute()

    return created.raw[0]
  }

  public async getMany(pageOptionsDto: QueryPaginationDto, queryCharacterDto: QueryEpisodeDto): Promise<GetManyEpisodes> {
    const queryBuilder = this.builder.skip(pageOptionsDto.skip).take(pageOptionsDto.take).addOrderBy('episode.id', pageOptionsDto.order)

    this.buildQueries(queryBuilder, queryCharacterDto)
    this.buildRelations(queryBuilder)

    const [episodes, count] = await queryBuilder.getManyAndCount()
    return { episodes, count }
  }

  public async getOne(id: number): Promise<Episode | null> {
    const queryBuilder = this.builder
    this.buildRelations(queryBuilder)

    return queryBuilder.where('episode.id = :id', { id }).getOne()
  }

  public async updateOne(id: number, updateEpisodeDto: UpdateEpisodeDto): Promise<Episode> {
    const queryBuilder = this.builder

    const updated = await queryBuilder.update(Episode).set(updateEpisodeDto).where('id = :id', { id }).returning('*').execute()

    return updated.raw[0]
  }

  public async removeOne(id: number): Promise<Episode> {
    const queryBuilder = this.builder

    const removed = await queryBuilder.delete().from(Episode).where('id = :id', { id }).returning('*').execute()

    return removed.raw[0]
  }
}
