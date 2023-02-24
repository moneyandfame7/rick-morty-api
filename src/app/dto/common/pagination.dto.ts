import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'
import { Type } from 'class-transformer'

import { Order } from '@common/constants/order.constant'

export class QueryPaginationDto {
  @IsIn(['DESC', 'ASC'])
  @IsOptional()
  public readonly order?: Order = Order.ASC

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  public readonly page: number = 1

  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(50)
  @IsOptional()
  public readonly take: number = 20

  @IsString()
  @IsOptional()
  public readonly otherQuery?: string

  @IsString()
  @IsOptional()
  public readonly endpoint: string

  public get skip(): number {
    return (this.page - 1) * this.take
  }
}
