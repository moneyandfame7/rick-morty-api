import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateLocationDto } from './dto/create-location.dto'
import { UpdateLocationDto } from './dto/update-location.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Location } from './entities/location.entity'
import { Repository, SelectQueryBuilder } from 'typeorm'

@Injectable()
export class LocationService {
  private readonly queryBuilder: SelectQueryBuilder<Location> = this.locationRepository
    .createQueryBuilder('location')
    .innerJoinAndSelect('location.residents', 'residents')
    .select(['location', 'location.id'])
    .loadAllRelationIds()

  constructor(@InjectRepository(Location) private readonly locationRepository: Repository<Location>) {}

  create(createLocationDto: CreateLocationDto) {
    return this.locationRepository.create(createLocationDto)
  }

  async findAll() {
    const locations = await this.locationRepository.find({
      loadRelationIds: {
        relations: ['residents']
      }
    })
    if (!locations) {
      throw new NotFoundException('Locations not found')
    }
    return locations
  }

  async findOne(id: number) {
    const location = await this.locationRepository.findOne({
      loadRelationIds: {
        relations: ['residents']
      },
      where: {
        id
      }
    })
    if (!location) {
      throw new NotFoundException(`Location with id ${id} not found`)
    }
    return location
  }

  update(id: number, updateLocationDto: UpdateLocationDto) {
    return `This action updates a #${id} location`
  }

  remove(id: number) {
    return `This action removes a #${id} location`
  }
}
