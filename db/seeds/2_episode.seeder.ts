import { CreateEpisodeDto } from 'src/episode/dto/create-episode.dto'
import { Episode } from 'src/episode/entities/episode.entity'
import { DataSource } from 'typeorm'
import { Seeder, SeederFactoryManager } from 'typeorm-extension'
export class EpisodeSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    const episodeRepository = dataSource.getRepository(Episode)

    const episodeData: CreateEpisodeDto = {
      name: 'TEST NAME',
      episode: 'TEST EPISODE',
      airDate: 'TEST AIR_DATE',
      createdAt: new Date()
    }

    const newEpisode = episodeRepository.create(episodeData)
    await episodeRepository.save(newEpisode)

    console.log('✅ Episode created successfully.')
  }
}
