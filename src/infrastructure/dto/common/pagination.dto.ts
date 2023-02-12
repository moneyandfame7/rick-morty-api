import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { Order } from '../../common/constants/order.constant'

export class QueryPaginationDto {
  @IsString()
  @IsIn(['DESC', 'ASC'])
  @IsOptional()
  readonly order?: Order = Order.ASC

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number = 1

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  readonly take?: number = 20

  @IsString()
  @IsOptional()
  readonly otherQuery?: string

  @IsString()
  @IsOptional()
  readonly endpoint: string

  get skip(): number {
    return (this.page - 1) * this.take
  }
}
