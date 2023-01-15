export class CreateCharacterDto {
  name: string
  type: string
  status: string
  gender: string
  species: string
  image: string
  originId?: number
  locationId?: number
  createdAt: Date
}
