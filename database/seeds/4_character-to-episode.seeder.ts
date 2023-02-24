import { DataSource } from 'typeorm'
import { Seeder } from 'typeorm-extension'

import { Episode } from '@infrastructure/entities/main/episode.entity'

import { fetchData } from '@common/utils/fetch-data'
import { getIdFromUrl } from '@common/utils/get-id-from-url'

import { IEpisode } from './2_episode.seeder'

export class CharacterToEpisodeSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    try {
      const episodeRepository = dataSource.getRepository(Episode)

      const responseEpisode = await fetchData<IEpisode>('https://rickandmortyapi.com/api/episode')
      const _episodes = await episodeRepository.find()
      for (let i = 0; i < responseEpisode.length; i++) {
        for (let j = 0; j < responseEpisode[i].characters.length; j++) {
          const characterId = getIdFromUrl(responseEpisode[i].characters[j])
          await dataSource.createQueryBuilder().relation(Episode, 'characters').of(_episodes[i].id).add(characterId)
          console.log(`✅ Character ${characterId} was added successfully`)
        }
      }
    } catch (e) {
      console.log('❌ Character to episode filling failed.')
    }
  }
}
