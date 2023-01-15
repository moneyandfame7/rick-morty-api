import { CreateEpisodeDto } from 'src/episode/dto/create-episode.dto'
import { Episode } from 'src/episode/entities/episode.entity'
import { IEpisode } from 'src/types'
import { fetchData } from 'src/utils/fetch-data'
import { DataSource } from 'typeorm'
import { Seeder, SeederFactoryManager } from 'typeorm-extension'
export class EpisodeSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    try {
      const episodeRepository = dataSource.getRepository(Episode)
      const episodes: CreateEpisodeDto[] = []
      const responseEpisode = await fetchData<IEpisode>('https://rickandmortyapi.com/api/episode')
      responseEpisode.map(episode => {
        episodes.push({
          name: episode.name,
          airDate: episode.air_date,
          episode: episode.episode,
          createdAt: new Date()
        })
      })

      await episodeRepository.insert(episodes)
      console.log('✅ Episodes filling successfully.')
    } catch (error) {
      console.log('❌ Episodes filling failed.')
    }
  }
}
