import { DataSource, Repository, SelectQueryBuilder } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { Location } from './entities/location.entity'
import { PageOptionsDto } from '../shared/page-info/dto/page-options.dto'
import { QueryLocationDto } from './dto/query-location.dto'
import { UpdateLocationDto } from './dto/update-location.dto'
import { CreateLocationDto } from './dto/create-location.dto'

@Injectable()
export class LocationRepository extends Repository<Location> {
  constructor(private dataSource: DataSource) {
    super(Location, dataSource.createEntityManager())
  }

  private get builder(): any {
    return this.createQueryBuilder('location')
  }

  private buildQueries(builder: SelectQueryBuilder<Location>, queries: QueryLocationDto) {
    queries.id ? builder.where('location.id IN (:...ids)', { ids: queries.id }) : null

    queries.name ? builder.andWhere('location.name ilike :name', { name: `%${queries.name}%` }) : null

    queries.dimension ? builder.andWhere('location.dimension ilike :dimension', { dimension: `%${queries.dimension}%` }) : null

    queries.type ? builder.andWhere('location.type startswith :type', { type: queries.type }) : null

    queries.resident_name ? builder.andWhere('residents.name ilike :resident_name', { resident_name: `%${queries.resident_name}%` }) : null
  }

  private buildRelations(builder: SelectQueryBuilder<Location>) {
    builder.leftJoinAndSelect('location.residents', 'residents').loadAllRelationIds({ relations: ['residents'] })
  }

  public async createOne(createLocationDto: CreateLocationDto) {
    const queryBuilder: SelectQueryBuilder<Location> = this.builder
    const created = await queryBuilder.insert().into(Location).values(createLocationDto).returning('*').execute()

    return created.raw[0]
  }

  public async getMany(pageOptionsDto: PageOptionsDto, queryLocationDto: QueryLocationDto): Promise<{ locations: Location[]; count: number }> {
    const queryBuilder: SelectQueryBuilder<Location> = this.builder.skip(pageOptionsDto.skip).take(pageOptionsDto.take).addOrderBy('location.id', pageOptionsDto.order)

    this.buildQueries(queryBuilder, queryLocationDto)
    this.buildRelations(queryBuilder)

    const [locations, count] = await queryBuilder.getManyAndCount()
    return { locations, count }
  }

  public async getOne(id: number): Promise<Location> {
    const queryBuilder: SelectQueryBuilder<Location> = this.builder
    this.buildRelations(queryBuilder)

    return await queryBuilder.where('location.id = :id', { id }).getOne()
  }

  public async updateOne(id: number, updateLocationDto: UpdateLocationDto): Promise<Location> {
    const queryBuilder: SelectQueryBuilder<Location> = this.builder

    const updated = await queryBuilder.update(Location).set(updateLocationDto).where('id = :id', { id }).returning('*').execute()

    return updated.raw[0]
  }

  public async removeOne(id: number): Promise<Location> {
    const queryBuilder: SelectQueryBuilder<Location> = this.builder

    const removed = await queryBuilder.delete().from(Location).where('id = :id', { id }).returning('*').execute()

    return removed.raw[0]
  }

  public async getCount(): Promise<number> {
    const queryBuilder = this.builder

    return queryBuilder.getCount()
  }
}
