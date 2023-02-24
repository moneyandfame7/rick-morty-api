import type { Location } from '@infrastructure/entities/main/location.entity'

export interface GetManyLocations {
  locations: Location[] | null
  count: number
}
