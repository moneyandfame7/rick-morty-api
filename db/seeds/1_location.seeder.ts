import { Location } from 'src/location/entities/location.entity'
import { DataSource } from 'typeorm'
import { Seeder, SeederFactoryManager } from 'typeorm-extension'
export class LocationSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    const locationRepository = dataSource.getRepository(Location)

    const locationData = {
      name: 'TEST NAME',
      type: 'TEST TYPE',
      dimension: 'TEST DIMENSION',
      createdAt: new Date()
    }

    const newLocation = locationRepository.create(locationData)
    const locationExists = locationRepository.findOneBy({ id: newLocation.id })
    locationExists ? console.log('❌ Location already exist.') : await locationRepository.save(newLocation)
  }
}
