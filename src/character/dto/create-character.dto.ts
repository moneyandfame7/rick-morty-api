import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsDate, IsIn, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator'
import { CreateLocationDto } from '../../location/dto/create-location.dto'
import { Episode } from '../../episode/entities/episode.entity'

export class CreateCharacterDto {
  @IsNumber()
  @IsOptional()
  id?: number

  @ApiProperty({ example: 'Rick Sanchez', description: 'The name of the character.' })
  @IsNotEmpty()
  name: string

  @ApiProperty({ example: 'Genetic experiment', description: 'The type or subspecies of the character.' })
  @IsString()
  type: string

  @ApiProperty({ example: 'Alive', description: "The status of the character ('Alive', 'Dead' or 'unknown')." })
  @IsIn(['Alive', 'Dead', 'unknown'])
  @IsNotEmpty()
  status: string

  @ApiProperty({
    example: 'Male',
    description: "The gender of the character ('Female', 'Male', 'Genderless' or 'unknown')."
  })
  @IsIn(['Female', 'Male', 'Genderless', 'unknown'])
  @IsString()
  gender: string = 'unknown'

  @ApiProperty({ example: 'Human', description: 'The species of the character.' })
  @IsString()
  @IsNotEmpty()
  species: string

  @ApiProperty({ example: 'https://example.com/images/1', description: 'Link to character`s photo.' })
  @IsString()
  @IsOptional()
  image?: string

  @IsObject()
  @ApiProperty({
    example: {
      name: 'Earth (C-137)',
      type: 'Planet',
      dimension: 'Dimension C-137'
    },
    description: "Info to the character's origin location."
  })
  @IsOptional()
  location?: CreateLocationDto

  @ApiProperty({
    example: {
      name: 'Earth (C-137)',
      type: 'Planet',
      dimension: 'Dimension C-137'
    },
    description: "Info to the character's last known location endpoint."
  })
  @IsObject()
  @IsOptional()
  origin?: CreateLocationDto

  @ApiProperty({
    example: [1, 2, 3, 4, 5, 7, 10],
    description: "List of episode's id in which this character appeared."
  })
  @IsArray()
  @IsOptional()
  episodes?: Episode[]

  @IsDate()
  @IsOptional()
  createdAt?: Date = new Date()
}
