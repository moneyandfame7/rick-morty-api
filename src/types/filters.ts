interface BasicFilters {
  id: number[]
  name: string
  /* sort from start | end */
  order?: 'ASC' | 'DESC'
}

interface CharactersFilters {
  status: string
  species: string
  type: string
  gender: string
}

interface EpisodeFilters {
  episode: string
  characters: Array<string> | string
}

interface LocationFilters {
  type: string
  dimension: string
  residents: Array<string> | string
}

export interface Pagination {
  otherQuery?: string
  take?: number
  order?: string
  page: number
  count: number
}

export type PossibleOptions = BasicFilters & CharactersFilters & EpisodeFilters & LocationFilters & Pagination
