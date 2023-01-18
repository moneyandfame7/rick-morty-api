import { IsNotEmpty, IsString } from 'class-validator'

export class CreateEpisodeDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  episode: string

  @IsString()
  @IsNotEmpty()
  airDate: string
  createdAt: Date
}
