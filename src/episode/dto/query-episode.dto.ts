import { IsOptional, IsString } from 'class-validator'
import { Transform } from 'class-transformer'
import { toCorrectId } from '../../shared/transforms/to-correct-id.transform'
import { PageOptionsDto } from 'src/shared/page-info/dto/page-options.dto'
import { ApiProperty } from '@nestjs/swagger'

export class QueryEpisodeDto extends PageOptionsDto {
  @ApiProperty({ example: 1, description: 'The id of the episode.' })
  @Transform(({ value }) => toCorrectId(value))
  @IsOptional()
  id?: number[]

  @ApiProperty({ example: 'Pilot', description: 'The name of the episode.' })
  @IsOptional()
  @IsString()
  name?: string

  @ApiProperty({ example: 'S01E01', description: 'The code of the episode.' })
  @IsOptional()
  @IsString()
  episode?: string

  @ApiProperty({ example: 'S01E01', description: 'The name of the character who was present in the episode' })
  @IsOptional()
  @IsString()
  character_name?: string
}
