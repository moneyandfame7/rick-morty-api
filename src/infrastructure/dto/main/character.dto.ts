import { IsArray, IsDate, IsIn, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator'
import { Transform } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { PartialType } from '@nestjs/mapped-types'
import { CreateLocationDto } from './location.dto'
import { Episode } from '../../entities/main/episode.entity'
import { QueryPaginationDto } from '../common/pagination.dto'
import { toCorrectId } from '../../common/transforms/to-correct-id.transform'

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
    description: "Info to the character's origin location.",
    type: () => CreateLocationDto
  })
  @IsOptional()
  location?: CreateLocationDto

  @ApiProperty({
    example: {
      name: 'Earth (C-137)',
      type: 'Planet',
      dimension: 'Dimension C-137'
    },
    description: "Info to the character's last known location endpoint.",
    type: () => CreateLocationDto
  })
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

export class QueryCharacterDto extends QueryPaginationDto {
  @ApiProperty({ example: [1], description: 'The id of the character.', required: false })
  @Transform(({ value }) => toCorrectId(value))
  @IsOptional()
  id?: number[]

  @IsOptional()
  @ApiProperty({ example: 'Rick Sanchez', description: 'The name of the character.', required: false })
  @IsString()
  name?: string

  @ApiProperty({
    example: 'Alive',
    description: "The status of the character ('Alive', 'Dead' or 'unknown').",
    required: false
  })
  @IsOptional()
  @IsIn(['Alive', 'Dead', 'unknown'])
  @IsString()
  status?: string

  @ApiProperty({
    example: 'Genetic experiment',
    description: 'The type or subspecies of the character.',
    required: false
  })
  @IsOptional()
  @IsString()
  type?: string

  @ApiProperty({ example: 'Human', description: 'The species of the character.', required: false })
  @IsOptional()
  @IsString()
  species?: string

  @IsOptional()
  @ApiProperty({
    example: 'Male',
    description: "The gender of the character ('Female', 'Male', 'Genderless' or 'unknown').",
    required: false
  })
  @IsIn(['Female', 'Male', 'Genderless', 'unknown'])
  @IsString()
  gender?: string

  @ApiProperty({ example: 'Pilot', description: 'The name of the episode.', required: false })
  @IsOptional()
  @IsString()
  episode_name?: string
}

export class UpdateCharacterDto extends PartialType(CreateCharacterDto) {}
