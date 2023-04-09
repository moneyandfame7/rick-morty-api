import { DataSource } from 'typeorm'
import type { Seeder } from 'typeorm-extension'

import type { EpisodeResponse } from '../interfaces'

import { CreateEpisodeDto } from '@infrastructure/dto/main/episode.dto'

import { Episode } from '@infrastructure/entities/main/episode.entity'

import { fetchData } from '@common/utils/fetch-data'

export class EpisodeSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    try {
      const episodeRepository = dataSource.getRepository(Episode)
      const episodes: CreateEpisodeDto[] = []
      const responseEpisode = await fetchData<EpisodeResponse>('https://rickandmortyapi.com/api/episode')
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
