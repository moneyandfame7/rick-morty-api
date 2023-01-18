import { IsNumber, IsOptional, Min } from 'class-validator'
import { Transform } from 'class-transformer'
import { toCorrectId } from '../../common/helper'
import * as _ from 'lodash'

export class QueryDto {
  @IsOptional()
  @Transform(({ value }) => _.toNumber(value))
  @IsNumber()
  @Min(1)
  page: number = 1

  @Transform(({ value }) => _.toNumber(value))
  @IsOptional()
  take: number

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

  // @IsOptional()
  // episode: number | string;
}
