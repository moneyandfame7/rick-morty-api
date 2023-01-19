import { IsDate, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator'
import { CreateLocationDto } from '../../location/dto/create-location.dto'

export class CreateCharacterDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  type: string

  @IsString()
  @IsNotEmpty()
  status: string

  @IsString()
  @IsNotEmpty()
  gender: string

  @IsString()
  @IsNotEmpty()
  species: string

  @IsString()
  @IsNotEmpty()
  image: string

  @IsObject()
  @IsNotEmpty()
  location?: CreateLocationDto

  @IsObject()
  @IsNotEmpty()
  origin?: CreateLocationDto

  @IsDate()
  @IsOptional()
  createdAt?: Date
}
