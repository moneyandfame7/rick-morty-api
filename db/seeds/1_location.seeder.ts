import { CreateLocationDto } from 'src/location/dto/create-location.dto'
import { Location } from 'src/location/entities/location.entity'
import { ILocation } from 'src/types'
import { fetchData } from 'src/utils/fetch-data'
import { DataSource } from 'typeorm'
import { Seeder, SeederFactoryManager } from 'typeorm-extension'

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
