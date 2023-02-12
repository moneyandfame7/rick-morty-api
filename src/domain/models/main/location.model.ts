import { Location } from 'src/infrastructure/entities/main/location.entity'

export interface LocationModel {}

export interface GetManyLocations {
  locations: Location[]
  count: number
}
