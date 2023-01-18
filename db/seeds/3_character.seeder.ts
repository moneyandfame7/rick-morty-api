import { CreateCharacterDto } from 'src/character/dto/create-character.dto'
import { Character } from 'src/character/entities/character.entity'
import { ICharacter, ILocation } from 'src/types'
import { fetchData } from 'src/utils/fetch-data'
import { DataSource } from 'typeorm'
import { Seeder, SeederFactoryManager } from 'typeorm-extension'
import { getIdFromUrl } from '../../src/utils/get-id-from-url'

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
