import { CreateLocationDto } from '../../location/dto/create-location.dto'

export class CreateCharacterDto {
  name: string
  type: string
  status: string
  gender: string
  species: string
  image: string
  location?: CreateLocationDto
  origin?: CreateLocationDto
  createdAt: Date
}
