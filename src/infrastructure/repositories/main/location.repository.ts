import { DataSource, type SelectQueryBuilder } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { Location } from '@entities/main/location.entity'
import { BaseRepository } from '@domain/repositories/base-repository.abstract'
import type { QueryPaginationDto } from '@dto/common/pagination.dto'
import type { CreateLocationDto, QueryLocationDto, UpdateLocationDto } from '@dto/main/location.dto'
import type { GetManyLocations } from '@domain/models/main/location.model'

@Injectable()
export class LocationRepository extends BaseRepository<Location, QueryLocationDto, CreateLocationDto, UpdateLocationDto, GetManyLocations> {
  public constructor(protected dataSource: DataSource) {
    super(dataSource, 'location', Location)
  }

  protected buildQueries(builder: SelectQueryBuilder<Location>, queries: QueryLocationDto): void {
    if (queries.id) {
      const ids = this.toCorrectQuerieIds(queries.id)

      queries.id ? builder.where('location.id IN (:...ids)', { ids }) : null
    }

    queries.name ? builder.andWhere('location.name ilike :name', { name: `%${queries.name}%` }) : null

    queries.dimension ? builder.andWhere('location.dimension ilike :dimension', { dimension: `%${queries.dimension}%` }) : null

    queries.type ? builder.andWhere('location.type startswith :type', { type: queries.type }) : null

    queries.resident_name ? builder.andWhere('residents.name ilike :resident_name', { resident_name: `%${queries.resident_name}%` }) : null
  }

  protected buildRelations(builder: SelectQueryBuilder<Location>): void {
    builder.leftJoinAndSelect('location.residents', 'residents').loadAllRelationIds({ relations: ['residents'] })
  }

  public async createOne(createLocationDto: CreateLocationDto): Promise<Location> {
    const queryBuilder = this.builder
    const created = await queryBuilder.insert().into(Location).values(createLocationDto).returning('*').execute()

    return created.raw[0]
  }

  public async getMany(paginationDto: QueryPaginationDto, queryLocationDto: QueryLocationDto): Promise<GetManyLocations> {
    const queryBuilder = this.builder.skip(paginationDto.skip).take(paginationDto.take).addOrderBy('location.id', paginationDto.order)

    this.buildQueries(queryBuilder, queryLocationDto)
    this.buildRelations(queryBuilder)

    const [locations, count] = await queryBuilder.getManyAndCount()
    return { locations, count }
  }

  public async getOne(id: number): Promise<Location | null> {
    const queryBuilder = this.builder
    this.buildRelations(queryBuilder)

    return queryBuilder.where('location.id = :id', { id }).getOne()
  }

  public async updateOne(id: number, updateLocationDto: UpdateLocationDto): Promise<Location> {
    const queryBuilder = this.builder

    const updated = await queryBuilder.update(Location).set(updateLocationDto).where('id = :id', { id }).returning('*').execute()

    return updated.raw[0]
  }

  public async removeOne(id: number): Promise<Location> {
    const queryBuilder = this.builder

    const removed = await queryBuilder.delete().from(Location).where('id = :id', { id }).returning('*').execute()

    return removed.raw[0]
  }
}
