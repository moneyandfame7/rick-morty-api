import { IsIn, IsOptional, IsString } from 'class-validator'
import { Transform } from 'class-transformer'
import { toCorrectId } from '../../common/helper'
import { PageOptionsDto } from '../../common/page-info/dto/page-options.dto'

export class QueryCharacterDto extends PageOptionsDto {
  @Transform(({ value }) => toCorrectId(value))
  @IsOptional()
  id: number[]

  @IsOptional()
  name: string

  @IsOptional()
  @Transform(({ value }) => value.toLowerCase())
  @IsIn(['Alive', 'Dead', 'unknown'])
  status: string

  @IsOptional()
  @IsString()
  type: string

  @IsOptional()
  @IsString()
  species: string

  @IsOptional()
  @IsIn(['Female', 'Male', 'Genderless', 'unknown'])
  @IsString()
  gender: string

  @IsString()
  @IsOptional()
  episode_name: string
}
