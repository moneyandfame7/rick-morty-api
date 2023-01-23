import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateLocationDto } from './dto/create-location.dto'
import { UpdateLocationDto } from './dto/update-location.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Location } from './entities/location.entity'
import { QueryLocationDto } from './dto/query-location.dto'
import { PageOptionsDto } from 'src/shared/page-info/dto/page-options.dto'
import { PageInfoDto } from 'src/shared/page-info/dto/page-info.dto'
import { PageDto } from 'src/shared/page-info/dto/page.dto'
import { LocationRepository } from './location.repository'

@Injectable()
export class LocationService {
  constructor(@InjectRepository(Location) private readonly locationRepository: LocationRepository) {}

  async createOne(createLocationDto: CreateLocationDto) {
    const exist = this.locationRepository.findOneBy({ name: createLocationDto.name })
    if (exist) throw new BadRequestException('Location already exist.')

    const episode = this.locationRepository.create(createLocationDto)
    return await this.locationRepository.save(episode)
  }

  async getMany(pageOptionsDto: PageOptionsDto, queryLocationDto: QueryLocationDto) {
    const { locations, count } = await this.locationRepository.getMany(pageOptionsDto, queryLocationDto)

    if (!count) throw new BadRequestException(`Locations not found.`)

    const pageInfoDto = new PageInfoDto({ pageOptionsDto, count })
    return new PageDto(locations, pageInfoDto)
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

  async getCount(): Promise<number> {
    return await this.locationRepository.getCount()
  }
}
