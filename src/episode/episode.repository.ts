import { DataSource, Repository, SelectQueryBuilder } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { Episode } from './entities/episode.entity'
import { PageOptionsDto } from '../shared/page-info/dto/page-options.dto'
import { QueryEpisodeDto } from './dto/query-episode.dto'
import { CreateEpisodeDto } from './dto/create-episode.dto'
import { UpdateEpisodeDto } from './dto/update-episode.dto'

@Injectable()
export class EpisodeRepository extends Repository<Episode> {
  constructor(private dataSource: DataSource) {
    super(Episode, dataSource.createEntityManager())
  }

  private get builder(): any {
    return this.createQueryBuilder('episode')
  }

  private buildQueries(builder: SelectQueryBuilder<Episode>, queries: QueryEpisodeDto) {
    queries.id ? builder.where('episode.id IN (:...id)', { id: queries.id }) : null

    queries.name ? builder.andWhere('episode.name ilike :name', { name: `%${queries.name}%` }) : null

    queries.episode ? builder.andWhere('episode.episode = :episode', { episode: queries.name }) : null

    queries.character_name ? builder.andWhere('characters.name = :character_name', { character_name: queries.character_name }) : null
  }

  private buildRelations(builder: SelectQueryBuilder<Episode>) {
    builder.leftJoinAndSelect('episode.characters', 'characters').loadAllRelationIds({ relations: ['characters'] })
  }

  public async createOne(createEpisodeDto: CreateEpisodeDto) {
    const queryBuilder: SelectQueryBuilder<Episode> = this.builder
    const created = await queryBuilder.insert().into(Episode).values(createEpisodeDto).returning('*').execute()

    return created.raw[0]
  }

  public async getMany(pageOptionsDto: PageOptionsDto, queryCharacterDto: QueryEpisodeDto): Promise<{ episodes: Episode[]; count: number }> {
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

  public async getCount(): Promise<number> {
    const queryBuilder = this.builder

    return queryBuilder.getCount()
  }
}
