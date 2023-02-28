import { Injectable } from '@nestjs/common'

import { PaginationService } from '@app/services/common'
import type { CreateLocationDto, QueryLocationDto, UpdateLocationDto } from '@app/dto/main'
import type { QueryPaginationDto } from '@app/dto/common'

import { LocationRepository } from '@infrastructure/repositories/main'
import { Location } from '@infrastructure/entities/main'

import type { BaseService } from '@core/services/main'
import type { Presenter } from '@core/services/common'

import { LocationException } from '@common/exceptions/main'

@Injectable()
export class LocationService implements BaseService<Location, CreateLocationDto, UpdateLocationDto, QueryLocationDto> {
  public constructor(
    private readonly locationRepository: LocationRepository,
    private readonly paginationService: PaginationService<Location>,
    private readonly locationsException: LocationException
  ) {}

  public async createOne(createLocationDto: CreateLocationDto): Promise<Location> {
    const exists = await this.locationRepository.findOneBy({ name: createLocationDto.name })
    if (exists) {
      throw this.locationsException.alreadyExists(exists.name)
    }

    const location = await this.locationRepository.create(createLocationDto)
    return this.locationRepository.save(location)
  }

  public async getMany(queryPaginationDto: QueryPaginationDto, queryLocationDto: QueryLocationDto): Promise<Presenter<Location>> {
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
