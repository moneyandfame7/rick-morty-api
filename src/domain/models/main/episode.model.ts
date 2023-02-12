import { Episode } from '../../../infrastructure/entities/main/episode.entity'

export interface EpisodeModel {}

export interface GetManyEpisodes {
  episodes: Episode[]
  count: number
}
