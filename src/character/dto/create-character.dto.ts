import { IsDate, IsIn, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator'
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

  @IsIn(['Alive', 'Dead', 'unknown'])
  @IsString()
  @IsNotEmpty()
  status: string

  @IsOptional()
  @IsIn(['Female', 'Male', 'Genderless', 'unknown'])
  @IsString()
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
  createdAt?: Date = new Date()
}
