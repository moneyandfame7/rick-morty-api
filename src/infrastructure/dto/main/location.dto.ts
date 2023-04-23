import { ApiProperty } from '@nestjs/swagger'
import { PartialType } from '@nestjs/mapped-types'
import { IsArray, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator'

import { QueryPaginationDto } from '@infrastructure/dto/common'
import { locationProperties } from '@common/constants/entities-properties'

export class CreateLocationDto {
  @ApiProperty({ example: 'Earth (C-137)', description: 'The name of the location.' })
  @IsNotEmpty()
  public name: string

  @ApiProperty({ example: 'Planet', description: 'The type of the location.' })
  @IsNotEmpty()
  public type: string

  @ApiProperty({ example: 'Dimension C-137', description: 'The dimension in which the location is located.' })
  @IsNotEmpty()
  public dimension: string
}

export class QueryLocationDto extends QueryPaginationDto {
  @IsOptional()
  @IsString()
  public id?: string

  @IsOptional()
  @IsString()
  public name?: string

  @IsOptional()
  @IsString()
  public type?: string

  @IsOptional()
  @IsString()
  public dimension?: string

  @IsOptional()
  @IsString()
  public resident_name?: string
}

export class FieldsLocationDto {
  @IsArray()
  @IsIn(locationProperties, { each: true })
  public fields: string[]
}

export class UpdateLocationDto extends PartialType(CreateLocationDto) {}
