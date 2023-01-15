import { CreateEpisodeDto } from 'src/episode/dto/create-episode.dto'
import { Episode } from 'src/episode/entities/episode.entity'
import { IEpisode } from 'src/types'
import { fetchData } from 'src/utils/fetch-data'
import { getIdFromUrl } from 'src/utils/get-id-from-url'
import { DataSource } from 'typeorm'
import { Seeder, SeederFactoryManager } from 'typeorm-extension'
export class CharacterToEpisodeSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    const episodeRepository = dataSource.getRepository(Episode)

    const responseEpisode = await fetchData<IEpisode>('https://rickandmortyapi.com/api/episode')
    const _episodes = await episodeRepository.find()
    for (let i = 0; i < responseEpisode.length; i++) {
      for (let j = 0; j < responseEpisode[i].characters.length; j++) {
        const characterId = getIdFromUrl(responseEpisode[i].characters[j])
        await dataSource.createQueryBuilder().relation(Episode, 'characters').of(_episodes[i].id).add(characterId)
      }
    }

    console.log('✅ Episode created successfully.')
  }
}
