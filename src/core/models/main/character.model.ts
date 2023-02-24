import type { Character } from '@infrastructure/entities/main/character.entity'

export interface GetManyCharacters {
  characters: Character[] | null
  count: number
}
