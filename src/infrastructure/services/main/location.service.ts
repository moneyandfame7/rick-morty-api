import { Injectable } from '@nestjs/common'
import type { CreateLocationDto, QueryLocationDto, UpdateLocationDto } from '@dto/main/location.dto'
import type { QueryPaginationDto } from '@dto/common/pagination.dto'
import { LocationRepository } from '@repositories/main/location.repository'
import { PaginationService, type Response } from '../common/pagination.service'
import type { Location } from '@entities/main/location.entity'
import { LocationException } from '@domain/exceptions/main/location.exception'
import { BaseServiceAbstract } from '@domain/services/main/base-service.abstract'

@Injectable()
export class LocationService extends BaseServiceAbstract<Location, CreateLocationDto, UpdateLocationDto, QueryLocationDto> {
  public constructor(
    private readonly locationRepository: LocationRepository,
    private readonly paginationService: PaginationService<Location>,
    private readonly locationsException: LocationException
  ) {
    super()
  }

  public async createOne(createLocationDto: CreateLocationDto): Promise<Location> {
    const exists = await this.locationRepository.findOneBy({ name: createLocationDto.name })
    if (exists) {
      throw this.locationsException.alreadyExists(exists.name)
    }

    const location = this.locationRepository.create(createLocationDto)
    return this.locationRepository.save(location)
  }

  public async getMany(queryPaginationDto: QueryPaginationDto, queryLocationDto: QueryLocationDto): Promise<Response<Location>> {
    const { locations, count } = await this.locationRepository.getMany(queryPaginationDto, queryLocationDto)

    if (!count || !locations) {
      throw this.locationsException.manyNotFound()
    }

    const buildPaginationInfo = this.paginationService.buildPaginationInfo({ queryPaginationDto, count })
    return this.paginationService.wrapEntityWithPaginationInfo(locations, buildPaginationInfo)
  }

  public async getOne(id: number): Promise<Location> {
    const location = await this.locationRepository.getOne(id)

    if (!location) {
      throw this.locationsException.withIdNotFound(id)
    }

    return location
  }

  public async updateOne(id: number, updateLocationDto: UpdateLocationDto): Promise<Location> {
    const location = await this.locationRepository.getOne(id)

    if (!location) {
      throw this.locationsException.withIdNotFound(id)
    }
    return this.locationRepository.updateOne(id, updateLocationDto)
  }

  public async removeOne(id: number): Promise<Location> {
    const location = await this.locationRepository.getOne(id)

    if (!location) {
      throw this.locationsException.withIdNotFound(id)
    }

    return this.locationRepository.removeOne(id)
  }

  public async getCount(): Promise<number> {
    return this.locationRepository.getCount()
  }
}
