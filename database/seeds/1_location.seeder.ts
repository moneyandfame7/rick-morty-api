import { DataSource } from 'typeorm'
import type { Seeder } from 'typeorm-extension'

import type { LocationResponse } from '../interfaces'

import { CreateLocationDto } from '@app/dto/main'

import { Location } from '@infrastructure/entities/main'

import { fetchData } from '@common/utils'

export class LocationSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    try {
      const locationRepository = dataSource.getRepository(Location)
      const locations: CreateLocationDto[] = []
      const responseLocation = await fetchData<LocationResponse>('https://rickandmortyapi.com/api/location')
      responseLocation.map(location => {
        locations.push({
          name: location.name,
          type: location.type,
          dimension: location.dimension
        })
      })
      await locationRepository.insert(locations)
      console.log('✅ Locations filling successfully. ')
    } catch (error) {
      console.log(error)
      console.log('❌ Locations filling failed ')
    }
  }
}
