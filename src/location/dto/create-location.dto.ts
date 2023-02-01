import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

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
