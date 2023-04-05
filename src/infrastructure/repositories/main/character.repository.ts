import { DataSource, type SelectQueryBuilder } from 'typeorm'
import { Injectable } from '@nestjs/common'

import { CreateCharacterDto, QueryCharacterDto, UpdateCharacterDto } from '@app/dto/main'
import { QueryPaginationDto } from '@app/dto/common'

import { MainRepositoryAbstract } from '@core/repositories/main'
import type { GetManyCharacters } from '@core/models/main'

import { Character } from '@infrastructure/entities/main'

@Injectable()
export class CharacterRepository extends MainRepositoryAbstract<Character, QueryCharacterDto, CreateCharacterDto, UpdateCharacterDto, GetManyCharacters> {
  public constructor(protected dataSource: DataSource) {
    super(dataSource, 'character', Character)
  }

  protected buildQueries(builder: SelectQueryBuilder<Character>, queries: QueryCharacterDto): void {
    if (queries.id) {
      const ids = this.toCorrectQueriesId(queries.id)

      queries.id ? builder.where('character.id IN (:...ids)', { ids }) : null
    }

    queries.name ? builder.andWhere('character.name ilike :name', { name: `%${queries.name}%` }) : null

    queries.gender ? builder.andWhere('character.gender = :gender', { gender: queries.gender }) : null

    queries.episode_name ? builder.andWhere('episodes.name ilike :episode_name', { episode_name: `%${queries.episode_name}%` }) : null

    queries.type ? builder.andWhere('character.type = :type', { type: queries.type }) : null

    queries.status ? builder.andWhere('character.status = :status', { status: queries.status }) : null

    queries.species ? builder.andWhere('character.species = :species', { species: queries.species }) : null
  }

  protected buildRelations(builder: SelectQueryBuilder<Character>): void {
    builder
      .leftJoinAndSelect('character.origin', 'origin')
      .leftJoinAndSelect('character.location', 'location')
      .leftJoinAndSelect('character.episodes', 'episodes')
      .loadAllRelationIds({ relations: ['episodes'] })
  }

  public async createOne(createCharacterDto: CreateCharacterDto): Promise<Character> {
    const queryBuilder = this.builder
    const created = await queryBuilder.insert().into(Character).values(createCharacterDto).returning('*').execute()

    return created.raw[0]
  }

  public async getMany(paginationDto: QueryPaginationDto, queryCharacterDto: QueryCharacterDto): Promise<GetManyCharacters> {
    const queryBuilder = this.builder.skip(paginationDto.skip).take(paginationDto.take).addOrderBy('character.id', paginationDto.order)

    this.buildQueries(queryBuilder, queryCharacterDto)
    this.buildRelations(queryBuilder)

    const [characters, count] = await queryBuilder.getManyAndCount()
    return { characters, count }
  }

  public async getImages(): Promise<string[]> {
    const characters = await this.builder.select('image').take(45).getRawMany<Character>()
    return characters.map(char => char.image)
  }

  public async getOne(id: number): Promise<Character | null> {
    const queryBuilder = this.builder
    this.buildRelations(queryBuilder)

    return queryBuilder.where('character.id = :id', { id }).getOne()
  }

  public async updateOne(id: number, updateCharacterDto: UpdateCharacterDto): Promise<Character> {
    const queryBuilder = this.builder
    const updated = await queryBuilder.update(Character).set(updateCharacterDto).where('id = :id', { id }).returning('*').execute()

    return updated.raw[0]
  }

  public async removeOne(id: number): Promise<Character> {
    const queryBuilder = this.builder
    const removed = await queryBuilder.delete().from(Character).where('id = :id', { id }).returning('*').execute()

    return removed.raw[0]
  }
}
