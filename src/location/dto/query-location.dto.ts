import { IsOptional, IsString } from 'class-validator'
import { Transform } from 'class-transformer'
import { toCorrectId } from '../../shared/transforms/to-correct-id.transform'
import { PageOptionsDto } from 'src/shared/page-info/dto/page-options.dto'

export class QueryLocationDto extends PageOptionsDto {
  @Transform(({ value }) => toCorrectId(value))
  @IsOptional()
  id?: number[]

  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  type?: string

  @IsOptional()
  @IsString()
  dimension?: string

  @IsOptional()
  @IsString()
  resident_name?: string
}
