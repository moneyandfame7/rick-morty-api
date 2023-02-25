export interface LocationResponse {
  id: number
  name: string
  created: string
  url: string
  type: string
  dimension: string
  residents: string[]
}

export interface EpisodeResponse {
  id: number
  name: string
  created: string
  url: string
  air_date: string
  episode: string
  characters: string[]
}

export interface CharacterResponse {
  id: number
  name: string
  created: string
  url: string
  episode: string[]
  gender: string
  image: string
  type: string
  location: {
    name: string
    url: string
  }
  origin: {
    name: string
    url: string
  }
  species: string
  status: string
}
