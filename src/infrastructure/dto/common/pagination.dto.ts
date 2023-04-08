import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'
import { Type } from 'class-transformer'

import { ORDER } from '@common/constants'

export class QueryPaginationDto {
  @IsEnum(ORDER)
  @IsOptional()
  public order?: ORDER = ORDER.ASC

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  public page: number = 1

  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(50)
  @IsOptional()
  public take: number = 20

  @IsString()
  @IsOptional()
  public otherQuery?: string

  @IsString()
  @IsOptional()
  public endpoint: string

  public get skip(): number {
    return (this.page - 1) * this.take
  }
}
