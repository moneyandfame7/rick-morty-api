import { IsArray, IsDate, IsIn, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { PartialType } from '@nestjs/mapped-types'

import { CreateLocationDto } from '@app/dto/main'
import { QueryPaginationDto } from '@app/dto/common'

import { Episode } from '@infrastructure/entities/main/episode.entity'

export class CreateCharacterDto {
  @IsNumber()
  @IsOptional()
  public id?: number

  @ApiProperty({ example: 'Rick Sanchez', description: 'The name of the character.' })
  @IsNotEmpty()
  public name: string

  @ApiProperty({ example: 'Genetic experiment', description: 'The type or subspecies of the character.' })
  @IsOptional()
  public type: string

  @ApiProperty({ example: 'Alive', description: "The status of the character ('Alive', 'Dead' or 'unknown')." })
  @IsIn(['Alive', 'Dead', 'unknown'])
  public status: string

  @ApiProperty({
    example: 'Male',
    description: "The gender of the character ('Female', 'Male', 'Genderless' or 'unknown')."
  })
  @IsIn(['Female', 'Male', 'Genderless', 'unknown'])
  public gender: string

  @ApiProperty({ example: 'Human', description: 'The species of the character.' })
  @IsString()
  public species: string

  @ApiProperty({ example: 'https://example.com/images/1', description: 'Link to character`s photo.' })
  @IsString()
  @IsOptional()
  public image?: string

  // TODO: розібратись з локацією, можливо зробити так,
  //  шоб в dto юзер вводив імʼя локації, і шукати її вже потім,
  //  episode теж сам
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
  public location?: CreateLocationDto

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
  public origin?: CreateLocationDto

  @ApiProperty({
    example: [1, 2, 3, 4, 5, 7, 10],
    description: "List of episode's id in which this character appeared."
  })
  @IsArray()
  @IsOptional()
  public episodes?: Episode[]

  @IsDate()
  @IsOptional()
  public createdAt?: Date = new Date()
}

export class QueryCharacterDto extends QueryPaginationDto {
  @ApiProperty({ example: [1], description: 'The id of the character.', required: false })
  @IsOptional()
  public id?: string

  @IsOptional()
  @ApiProperty({ example: 'Rick Sanchez', description: 'The name of the character.', required: false })
  @IsString()
  public name?: string

  @ApiProperty({
    example: 'Alive',
    description: "The status of the character ('Alive', 'Dead' or 'unknown').",
    required: false
  })
  @IsOptional()
  @IsIn(['Alive', 'Dead', 'unknown'])
  @IsString()
  public status?: string

  @ApiProperty({
    example: 'Genetic experiment',
    description: 'The type or subspecies of the character.',
    required: false
  })
  @IsOptional()
  @IsString()
  public type?: string

  @ApiProperty({ example: 'Human', description: 'The species of the character.', required: false })
  @IsOptional()
  @IsString()
  public species?: string

  @IsOptional()
  @ApiProperty({
    example: 'Male',
    description: "The gender of the character ('Female', 'Male', 'Genderless' or 'unknown').",
    required: false
  })
  @IsIn(['Female', 'Male', 'Genderless', 'unknown'])
  @IsString()
  public gender?: string

  @ApiProperty({ example: 'Pilot', description: 'The name of the episode.', required: false })
  @IsOptional()
  @IsString()
  public episode_name?: string
}

export class UpdateCharacterDto extends PartialType(CreateCharacterDto) {}
