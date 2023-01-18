import { IsArray, IsNumber, IsOptional, Max, Min } from 'class-validator'
import { Transform } from 'class-transformer'
import { toCorrectId } from '../../common/helper'

export class QueryCharacterDto {
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => Number(value))
  @IsOptional()
  page: number = 1

  @IsNumber()
  @Min(1)
  @Max(100)
  @Transform(({ value }) => Number(value))
  take: number = 20

  @IsArray()
  @Transform(({ value }) => toCorrectId(value))
  @IsOptional()
  id: string

  @IsOptional()
  name: string

  @IsOptional()
  status: string

  @IsOptional()
  type: string

  @IsOptional()
  species: string

  @IsOptional()
  gender: string

  @IsOptional()
  episode_name: string
}
