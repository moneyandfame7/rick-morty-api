import type { Episode } from '@infrastructure/entities/main'

export interface GetManyEpisodes {
  episodes: Episode[] | null
  count: number
}
