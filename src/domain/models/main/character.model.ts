import { Character } from '../../../infrastructure/entities/main/character.entity'

export interface CharacterModel {}

export interface GetManyCharacters {
  characters: Character[]
  count: number
}
