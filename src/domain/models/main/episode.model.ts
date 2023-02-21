import type { Episode } from '@entities/main/episode.entity'

export interface GetManyEpisodes {
  episodes: Episode[] | null
  count: number
}
