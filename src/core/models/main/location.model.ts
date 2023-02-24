import type { Location } from '@infrastructure/entities/main'

export interface GetManyLocations {
  locations: Location[] | null
  count: number
}
