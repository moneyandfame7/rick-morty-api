import { PartialType } from '@nestjs/mapped-types'
import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { QueryPaginationDto } from '../common/pagination.dto'
import { toCorrectId } from '../../common/transforms/to-correct-id.transform'

export class CreateEpisodeDto {
  @ApiProperty({ example: 'Pilot', description: 'The name of the episode.' })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ example: 'S01E01', description: 'The code of the episode.' })
  @IsString()
  @IsNotEmpty()
  episode: string

  @ApiProperty({ example: 'December, 2, 2013', description: 'The air date of the episode.' })
  @IsString()
  @IsNotEmpty()
  airDate: string

  @ApiProperty({
    example: [1, 2, 3, 4, 5, 7, 10],
    description: 'List of characters who have been seen in the episode.'
  })
  characters?: any

  createdAt?: Date
}

export class QueryEpisodeDto extends QueryPaginationDto {
  @ApiProperty({ example: 1, description: 'The id of the episode.' })
  @Transform(({ value }) => toCorrectId(value))
  @IsOptional()
  id?: number[]

  @ApiProperty({ example: 'Pilot', description: 'The name of the episode.' })
  @IsOptional()
  @IsString()
  name?: string

  @ApiProperty({ example: 'S01E01', description: 'The code of the episode.' })
  @IsOptional()
  @IsString()
  episode?: string

  @ApiProperty({ example: 'S01E01', description: 'The name of the character who was present in the episode' })
  @IsOptional()
  @IsString()
  character_name?: string
}

export class UpdateEpisodeDto extends PartialType(CreateEpisodeDto) {}
