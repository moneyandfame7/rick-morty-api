import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { Order } from '../../constants/order.constant'

export class PageOptionsDto {
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

  get skip(): number {
    return (this.page - 1) * this.take
  }
}
