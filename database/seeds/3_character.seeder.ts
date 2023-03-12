import { DataSource } from 'typeorm'
import type { Seeder } from 'typeorm-extension'

import type { CharacterResponse, LocationResponse } from '../interfaces'

import { CreateCharacterDto } from '@app/dto/main'

import { Character } from '@infrastructure/entities/main'

import { fetchData, getIdFromUrl } from '@common/utils'

export class CharacterSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    try {
      const characterRepository = dataSource.getRepository(Character)
      const characters: CreateCharacterDto[] = []
      const responseLocation = await fetchData<LocationResponse>('https://rickandmortyapi.com/api/location')
      const responseCharacter = await fetchData<CharacterResponse>('https://rickandmortyapi.com/api/character')

      responseCharacter.map(async character => {
        characters.push({
          name: character.name,
          gender: character.gender,
          status: character.status,
          image: `${process.env.S3BUCKET_URL}/characters/${character.id}.jpeg`,
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
