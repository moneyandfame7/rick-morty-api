import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateLocationDto, QueryLocationDto, UpdateLocationDto } from 'src/infrastructure/dto/main/location.dto'
import { QueryPaginationDto } from 'src/infrastructure/dto/common/pagination.dto'
import { LocationRepository } from '../../repositories/main/location.repository'
import { PaginationService } from '../common/pagination.service'
import { Location } from '../../entities/main/location.entity'

@Injectable()
export class LocationService {
  constructor(private readonly locationRepository: LocationRepository, private readonly paginationService: PaginationService<Location>) {}

  async createOne(createLocationDto: CreateLocationDto) {
    const location = this.locationRepository.create(createLocationDto)
    return await this.locationRepository.save(location)
  }

  async getMany(queryPaginationDto: QueryPaginationDto, queryLocationDto: QueryLocationDto) {
    const { locations, count } = await this.locationRepository.getMany(queryPaginationDto, queryLocationDto)

    if (!count) throw new BadRequestException(`Locations not found.`)

    const buildPaginationInfo = this.paginationService.buildPaginationInfo({ queryPaginationDto, count })
    return this.paginationService.wrapEntityWithPaginationInfo(locations, buildPaginationInfo)
  }

  async getOne(id: number) {
    const location = await this.locationRepository.getOne(id)

    if (!location) throw new BadRequestException(`Location with id ${id}  does not exist.`)

    return location
  }

  async updateOne(id: number, updateLocationDto: UpdateLocationDto) {
    const location = await this.locationRepository.getOne(id)

    if (!location) throw new BadRequestException(`Location with id ${id} does not exist.`)

    return await this.locationRepository.updateOne(id, updateLocationDto)
  }

  async removeOne(id: number) {
    const location = await this.locationRepository.getOne(id)

    if (!location) throw new BadRequestException(`Location with id ${id} does not exist.`)

    return await this.locationRepository.removeOne(id)
  }

  async getCount() {
    return await this.locationRepository.getCount()
  }
}
