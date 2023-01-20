import { DataSource, Repository, SelectQueryBuilder } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { Character } from './entities/character.entity'
import { PageOptionsDto } from '../shared/page-info/dto/page-options.dto'
import { QueryCharacterDto } from './dto/query-character.dto'
import { UpdateCharacterDto } from './dto/update-character.dto'
import { CreateCharacterDto } from './dto/create-character.dto'

@Injectable()
export class CharacterRepository extends Repository<Character> {
  constructor(private dataSource: DataSource) {
    super(Character, dataSource.createEntityManager())
  }

  private get builder(): any {
    return this.createQueryBuilder('character')
  }

  private buildQueries(builder: SelectQueryBuilder<Character>, queries: QueryCharacterDto) {
    queries.id ? builder.where('character.id IN (:...ids)', { ids: queries.id }) : null

    queries.name ? builder.andWhere('character.name ilike :name', { name: `%${queries.name}%` }) : null

    queries.gender ? builder.andWhere('character.gender = :gender', { gender: queries.gender }) : null

    queries.episode_name ? builder.andWhere('episodes.name ilike :episode_name', { episode_name: `%${queries.episode_name}%` }) : null

    queries.type ? builder.andWhere('character.type = :type', { type: queries.type }) : null

    queries.status ? builder.andWhere('character.status = :status', { status: queries.status }) : null

    queries.species ? builder.andWhere('character.species = :species', { species: queries.species }) : null
  }

  private buildRelations(builder: SelectQueryBuilder<Character>) {
    builder
      .leftJoinAndSelect('character.origin', 'origin')
      .leftJoinAndSelect('character.location', 'location')
      .leftJoinAndSelect('character.episodes', 'episodes')
      .loadAllRelationIds({ relations: ['episodes'] })
  }

  public async createOne(createCharacterDto: CreateCharacterDto) {
    const queryBuilder: SelectQueryBuilder<Character> = this.builder
    const created = await queryBuilder.insert().into(Character).values(createCharacterDto).returning('*').execute()

    return created.raw[0]
  }

  public async getMany(pageOptionsDto: PageOptionsDto, queryCharacterDto: QueryCharacterDto): Promise<{ characters: Character[]; count: number }> {
    const queryBuilder: SelectQueryBuilder<Character> = this.builder.skip(pageOptionsDto.skip).take(pageOptionsDto.take).addOrderBy('character.id', pageOptionsDto.order)

    this.buildQueries(queryBuilder, queryCharacterDto)
    this.buildRelations(queryBuilder)

    const [characters, count] = await queryBuilder.getManyAndCount()
    return { characters, count }
  }

  public async getOne(id: number): Promise<Character> {
    const queryBuilder: SelectQueryBuilder<Character> = this.builder
    this.buildRelations(queryBuilder)

    return await queryBuilder.where('character.id = :id', { id }).getOne()
  }

  public async updateOne(id: number, updateCharacterDto: UpdateCharacterDto): Promise<Character> {
    const queryBuilder: SelectQueryBuilder<Character> = this.builder

    const updated = await queryBuilder.update(Character).set(updateCharacterDto).where('id = :id', { id }).returning('*').execute()

    return updated.raw[0]
  }

  public async removeOne(id: number): Promise<Character> {
    const queryBuilder: SelectQueryBuilder<Character> = this.builder

    const removed = await queryBuilder.delete().from(Character).where('id = :id', { id }).returning('*').execute()

    return removed.raw[0]
  }

  public async getCount(): Promise<number> {
    const queryBuilder = this.builder

    return queryBuilder.getCount()
  }
}
