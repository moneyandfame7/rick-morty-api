import type { DataSource } from 'typeorm'
import type { Seeder } from 'typeorm-extension'
import type { CreateCharacterDto } from '@dto/main/character.dto'
import { Character } from '@entities/main/character.entity'
import { fetchData } from '@common/utils/fetch-data'
import { getIdFromUrl } from '@common/utils/get-id-from-url'
import type { ILocation } from './1_location.seeder'

export interface ICharacter {
  id: number
  name: string
  created: string
  url: string
  episode: string[]
  gender: string
  image: string
  type: string
  location: {
    name: string
    url: string
  }
  origin: {
    name: string
    url: string
  }
  species: string
  status: string
}

export class CharacterSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    try {
      const characterRepository = dataSource.getRepository(Character)
      const characters: CreateCharacterDto[] = []
      const responseLocation = await fetchData<ILocation>('https://rickandmortyapi.com/api/location')
      const responseCharacter = await fetchData<ICharacter>('https://rickandmortyapi.com/api/character')

      responseCharacter.map(async character => {
        characters.push({
          name: character.name,
          gender: character.gender,
          status: character.status,
          image: `${process.env.S3BUCKET_URL}/${character.id}.jpeg`,
          species: character.species,
          // @ts-expect-error тому шо мені впадлу возитись
          location: responseLocation[getIdFromUrl(character.location.url) - 1],
          // @ts-expect-error така сама хуйня
          origin: responseLocation[getIdFromUrl(character.origin.url) - 1],
          type: character.type,
          createdAt: new Date()
        })
      })

      await characterRepository.insert(characters)
      if (characters) {
        console.log('✅ Characters filling successfully.')
      }
    } catch (error) {
      console.log('❌ Episodes filling failed.')
    }
  }
}
