import { DataSource } from 'typeorm'
import { Seeder, SeederFactoryManager } from 'typeorm-extension'
import { CreateCharacterDto } from 'src/character/dto/create-character.dto'
import { Character } from 'src/character/entities/character.entity'
import { fetchData } from 'src/utils/fetch-data'
import { getIdFromUrl } from 'src/utils/get-id-from-url'
import { ILocation } from './1_location.seeder'

export interface ICharacter {
  id: number
  name: string
  created: string
  url: string
  episode: Array<string>
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
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    try {
      const characterRepository = dataSource.getRepository(Character)
      const characters: CreateCharacterDto[] = []
      const responseLocation = await fetchData<ILocation>('https://rickandmortyapi.com/api/location')
      const responseCharacter = await fetchData<ICharacter>('https://rickandmortyapi.com/api/character')
      responseCharacter.map(character => {
        characters.push({
          name: character.name,
          gender: character.gender,
          status: character.status,
          image: character.image,
          species: character.species,
          location: responseLocation[getIdFromUrl(character.location.url) - 1],
          origin: responseLocation[getIdFromUrl(character.origin.url) - 1],
          type: character.type,
          createdAt: new Date()
        })
      })

      for (let i = 0; i < characters.length; i++) {}
      await characterRepository.insert(characters)
      console.log('✅ Characters filling successfully.')
    } catch (error) {
      console.log('❌ Episodes filling failed.')
    }
  }
}
