import { IsDate, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator'
import { CreateLocationDto } from '../../location/dto/create-location.dto'

export class CreateCharacterDto {
  @IsNumber()
  @IsOptional()
  id?: number

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
  @IsOptional()
  image?: string

  @IsObject()
  @IsOptional()
  location?: CreateLocationDto

  @IsObject()
  @IsOptional()
  origin?: CreateLocationDto

  @IsDate()
  @IsOptional()
  createdAt?: Date
}
