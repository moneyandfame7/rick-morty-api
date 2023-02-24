import { Injectable } from '@nestjs/common'
import type { Presenter } from '../common/pagination.service'
import { PaginationService } from '../common/pagination.service'
import { MainServiceAbstract } from '@core/services/main/main-service.abstract'
import type { CreateLocationDto, QueryLocationDto, UpdateLocationDto } from '@app/dto/main/location.dto'
import type { QueryPaginationDto } from '@app/dto/common/pagination.dto'
import { LocationException } from '@common/exceptions/main/location.exception'
import { LocationRepository } from '@infrastructure/repositories/main/location.repository'
import type { Location } from '@infrastructure/entities/main/location.entity'

@Injectable()
export class LocationService extends MainServiceAbstract<Location, CreateLocationDto, UpdateLocationDto, QueryLocationDto> {
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
