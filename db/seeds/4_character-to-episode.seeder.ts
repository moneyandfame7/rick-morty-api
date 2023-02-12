import { DataSource } from 'typeorm'
import { Seeder, SeederFactoryManager } from 'typeorm-extension'
import { Episode } from 'src/infrastructure/entities/main/episode.entity'
import { fetchData } from 'src/infrastructure/common/utils/fetch-data'
import { getIdFromUrl } from 'src/infrastructure/common/utils/get-id-from-url'
import { IEpisode } from './2_episode.seeder'

export class CharacterToEpisodeSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
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

    console.log('✅ Episode to character added successfully.')
  }
}
