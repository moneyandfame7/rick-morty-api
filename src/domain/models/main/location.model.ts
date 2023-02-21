import type { Location } from '@entities/main/location.entity'

export interface GetManyLocations {
  locations: Location[] | null
  count: number
}
