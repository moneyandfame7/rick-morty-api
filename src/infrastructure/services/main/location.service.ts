import { Injectable } from '@nestjs/common'
import type { CreateLocationDto, QueryLocationDto, UpdateLocationDto } from 'src/infrastructure/dto/main/location.dto'
import type { QueryPaginationDto } from 'src/infrastructure/dto/common/pagination.dto'
import { LocationRepository } from '../../repositories/main/location.repository'
import { PaginationService, type Payload } from '../common/pagination.service'
import type { Location } from '../../entities/main/location.entity'
import { LocationAlreadyExistsException, LocationsNotFoundException, LocationWithIdNotFoundException } from 'src/domain/exceptions/main/location.exception'

@Injectable()
export class LocationService {
  constructor(private readonly locationRepository: LocationRepository, private readonly paginationService: PaginationService<Location>) {}

  async createOne(createLocationDto: CreateLocationDto): Promise<Location> {
    const withSameName = await this.locationRepository.findOneBy({ name: createLocationDto.name })
    if (withSameName) throw new LocationAlreadyExistsException(createLocationDto.name)

    const location = this.locationRepository.create(createLocationDto)
    return this.locationRepository.save(location)
  }

  async getMany(queryPaginationDto: QueryPaginationDto, queryLocationDto: QueryLocationDto): Promise<Payload<Location>> {
    const { locations, count } = await this.locationRepository.getMany(queryPaginationDto, queryLocationDto)

    if (!count || !locations) throw new LocationsNotFoundException()

    const buildPaginationInfo = this.paginationService.buildPaginationInfo({ queryPaginationDto, count })
    return this.paginationService.wrapEntityWithPaginationInfo(locations, buildPaginationInfo)
  }

  async getOne(id: number): Promise<Location> {
    const location = await this.locationRepository.getOne(id)

    if (!location) throw new LocationWithIdNotFoundException(id)

    return location
  }

  async updateOne(id: number, updateLocationDto: UpdateLocationDto): Promise<Location> {
    const location = await this.locationRepository.getOne(id)

    if (!location) throw new LocationWithIdNotFoundException(id)
    return this.locationRepository.updateOne(id, updateLocationDto)
  }

  async removeOne(id: number): Promise<Location> {
    const location = await this.locationRepository.getOne(id)

    if (!location) throw new LocationWithIdNotFoundException(id)

    return this.locationRepository.removeOne(id)
  }

  async getCount(): Promise<number> {
    return this.locationRepository.getCount()
  }
}
