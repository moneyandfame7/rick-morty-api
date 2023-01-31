import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateEpisodeDto {
  @ApiProperty({ example: 'Pilot', description: 'The name of the episode.' })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ example: 'S01E01', description: 'The code of the episode.' })
  @IsString()
  @IsNotEmpty()
  episode: string

  @ApiProperty({ example: 'December, 2, 2013', description: 'The air date of the episode.' })
  @IsString()
  @IsNotEmpty()
  airDate: string

  @ApiProperty({
    example: [1, 2, 3, 4, 5, 7, 10],
    description: 'List of characters who have been seen in the episode.'
  })
  characters?: any

  createdAt?: Date
}
