import type { Character } from '@infrastructure/entities/main'

export interface GetManyCharacters {
  characters: Character[] | null
  count: number
}
