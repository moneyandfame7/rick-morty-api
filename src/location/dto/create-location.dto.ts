import { IsNotEmpty, IsString } from 'class-validator'

export class CreateLocationDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  type: string

  @IsString()
  @IsNotEmpty()
  dimension: string
}
