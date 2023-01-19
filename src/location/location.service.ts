import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateLocationDto } from './dto/create-location.dto'
import { UpdateLocationDto } from './dto/update-location.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Location } from './entities/location.entity'
import { FindManyOptions, Repository, SelectQueryBuilder } from 'typeorm'
import { QueryLocationDto } from './dto/query-location.dto'
import { PageOptionsDto } from 'src/shared/page-info/dto/page-options.dto'
import { filter } from 'lodash'
import { PageInfoDto } from 'src/shared/page-info/dto/page-info.dto'
import { PageDto } from 'src/shared/page-info/dto/page.dto'
import { log } from 'console'

@Injectable()
export class LocationService {
  constructor(@InjectRepository(Location) private readonly locationRepository: Repository<Location>) {}

  private get _builder() {
    return this.locationRepository.createQueryBuilder('location')
  }

  private _buildSearchFilters(builder: SelectQueryBuilder<Location>, filters: QueryLocationDto) {
    filters.id ? builder.where('location.id IN (:...ids)', { ids: filters.id }) : null

    filters.name ? builder.andWhere('location.name ilike :name', { name: `%${filters.name}%` }) : null

    filters.dimension
      ? builder.andWhere('location.dimension ilike :dimension', { dimension: `%${filters.dimension}%` })
      : null

    filters.type ? builder.andWhere('location.type startswith :type', { type: filters.type }) : null

    filters.resident_name
      ? builder.andWhere('residents.name ilike :resident_name', { resident_name: `%${filters.resident_name}%` })
      : null
  }

  private _buildRelations(builder: SelectQueryBuilder<Location>) {
    builder.leftJoinAndSelect('location.residents', 'residents').loadAllRelationIds()
  }

  async create(createLocationDto: CreateLocationDto) {
    const location = this.locationRepository.create(createLocationDto)
    return await this.locationRepository.save(location)
  }

  async findAll(pageOptionsDto: PageOptionsDto, queryLocation: QueryLocationDto) {
    const queryBuilder = this._builder
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take)
      .addOrderBy('location.id', pageOptionsDto.order)
    this._buildRelations(queryBuilder)
    this._buildSearchFilters(queryBuilder, queryLocation)

    const count = await queryBuilder.getCount()
    const locations = await queryBuilder.getMany()

    if (!locations.length) throw new NotFoundException(`Locations not found.`)

    const pageInfoDto = new PageInfoDto({ pageOptionsDto, count })
    return new PageDto(locations, pageInfoDto)
  }

  async findOne(id: number) {
    const queryBuilder = this._builder
    this._buildRelations(queryBuilder)

    const location = await queryBuilder.where('location.id = :id', { id }).getOne()
    if (!location) throw new BadRequestException(`Location with id ${id} doest not exist.`)

    return location
  }

  async update(id: number, updateLocationDto: UpdateLocationDto) {
    return await this.locationRepository.update(id, updateLocationDto)
  }

  async remove(id: number) {
    return await this.locationRepository.delete(id)
  }
}
