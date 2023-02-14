import { ApiProperty } from '@nestjs/swagger'
import { PartialType } from '@nestjs/mapped-types'
import { Transform } from 'class-transformer'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { QueryPaginationDto } from '../common/pagination.dto'
import { toCorrectId } from '../../common/transforms/to-correct-id.transform'

export class CreateLocationDto {
  @ApiProperty({ example: 'Earth (C-137)', description: 'The name of the location.' })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ example: 'Planet', description: 'The type of the location.' })
  @IsString()
  @IsNotEmpty()
  type: string

  @ApiProperty({ example: 'Dimension C-137', description: 'The dimension in which the location is located.' })
  @IsString()
  @IsNotEmpty()
  dimension: string

  // @ApiProperty({
  //   example: [1, 2, 3, 4, 5, 7, 10],
  //   description: 'List of character who have been last seen in the location.'
  // })
  // @IsArray()
  // residents?: Character[]
}

export class QueryLocationDto extends QueryPaginationDto {
  @Transform(({ value }) => toCorrectId(value))
  @IsOptional()
  id?: number[]

  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  type?: string

  @IsOptional()
  @IsString()
  dimension?: string

  @IsOptional()
  @IsString()
  resident_name?: string
}

export class UpdateLocationDto extends PartialType(CreateLocationDto) {}
