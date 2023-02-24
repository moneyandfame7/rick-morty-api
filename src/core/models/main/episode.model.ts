import type { Episode } from '@infrastructure/entities/main/episode.entity'

export interface GetManyEpisodes {
  episodes: Episode[] | null
  count: number
}
