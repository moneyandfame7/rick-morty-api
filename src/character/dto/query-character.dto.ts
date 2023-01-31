import { IsIn, IsOptional, IsString } from 'class-validator'
import { PageOptionsDto } from '../../shared/page-info/dto/page-options.dto'
import { toCorrectId } from '../../shared/transforms/to-correct-id.transform'
import { Transform } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class QueryCharacterDto extends PageOptionsDto {
  @ApiProperty({ example: [1], description: 'The id of the character.', required: false })
  @Transform(({ value }) => toCorrectId(value))
  @IsOptional()
  id?: number[]

  @IsOptional()
  @ApiProperty({ example: 'Rick Sanchez', description: 'The name of the character.', required: false })
  @IsString()
  name?: string

  @ApiProperty({ example: 'Alive', description: "The status of the character ('Alive', 'Dead' or 'unknown').", required: false })
  @IsOptional()
  @IsIn(['Alive', 'Dead', 'unknown'])
  @IsString()
  status?: string

  @ApiProperty({ example: 'Genetic experiment', description: 'The type or subspecies of the character.', required: false })
  @IsOptional()
  @IsString()
  type?: string

  @ApiProperty({ example: 'Human', description: 'The species of the character.', required: false })
  @IsOptional()
  @IsString()
  species?: string

  @IsOptional()
  @ApiProperty({
    example: 'Male',
    description: "The gender of the character ('Female', 'Male', 'Genderless' or 'unknown').",
    required: false
  })
  @IsIn(['Female', 'Male', 'Genderless', 'unknown'])
  @IsString()
  gender?: string

  @ApiProperty({ example: 'Pilot', description: 'The name of the episode.', required: false })
  @IsOptional()
  @IsString()
  episode_name?: string
}
