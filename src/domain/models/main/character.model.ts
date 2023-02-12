import { Character } from 'src/infrastructure/entities/main/character.entity'

export interface CharacterModel {}

export interface GetManyCharacters {
  characters: Character[]
  count: number
}
