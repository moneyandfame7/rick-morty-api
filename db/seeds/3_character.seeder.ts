import { CreateCharacterDto } from 'src/character/dto/create-character.dto'
import { Character } from 'src/character/entities/character.entity'
import { ICharacter } from 'src/types'
import { fetchData } from 'src/utils/fetch-data'
import { getIdFromUrl } from 'src/utils/get-id-from-url'
import { DataSource } from 'typeorm'
import { Seeder, SeederFactoryManager } from 'typeorm-extension'
export class CharacterSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    try {
      const characterRepository = dataSource.getRepository(Character)
      const characters: CreateCharacterDto[] = []
      const responseCharacter = await fetchData<ICharacter>('https://rickandmortyapi.com/api/character')
      responseCharacter.map(character => {
        characters.push({
          name: character.name,
          gender: character.gender,
          status: character.status,
          image: character.image,
          species: character.species,
          originId: getIdFromUrl(character.origin.url),
          locationId: getIdFromUrl(character.location.url),
          type: character.type,
          createdAt: new Date()
        })
      })
      await characterRepository.insert(characters)
      console.log('✅ Characters filling successfully.')
    } catch (error) {
      console.log('❌ Episodes filling failed.')
    }
  }
}
