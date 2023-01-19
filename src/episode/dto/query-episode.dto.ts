import { IsArray, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator'
import { Transform } from 'class-transformer'
import { toCorrectId } from '../../shared/transforms/to-correct-id.transform'
import { PageOptionsDto } from 'src/shared/page-info/dto/page-options.dto'

export class QueryEpisodeDto extends PageOptionsDto {
  @Transform(({ value }) => toCorrectId(value))
  @IsOptional()
  id: number[]

  @IsOptional()
  @IsString()
  name: string

  @IsOptional()
  @IsString()
  episode: string

  @IsOptional()
  @IsString()
  character_name: string
}
