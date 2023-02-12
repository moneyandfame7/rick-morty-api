import { DataSource } from 'typeorm'
import { Seeder, SeederFactoryManager } from 'typeorm-extension'
import { CreateLocationDto } from 'src/infrastructure/dto/main/location.dto'
import { Location } from 'src/infrastructure/entities/main/location.entity'
import { fetchData } from 'src/infrastructure/common/utils/fetch-data'

export interface ILocation {
  id: number
  name: string
  created: string
  url: string
  type: string
  dimension: string
  residents: string[]
}

export class LocationSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    try {
      const locationRepository = dataSource.getRepository(Location)
      const locations: CreateLocationDto[] = []
      const responseLocation = await fetchData<ILocation>('https://rickandmortyapi.com/api/location')
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
      console.log('❌ Locations filling failed ')
    }
  }
}
