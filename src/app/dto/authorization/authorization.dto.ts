import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, MinLength } from 'class-validator'
import { Type } from 'class-transformer'

export class AuthorizationDto {
  @ApiProperty({ example: 'user@gmail.com', description: 'The email of the user.' })
  @IsEmail()
  public readonly email: string

  @ApiProperty({
    example: '123user123',
    description: 'The password of the user.'
  })
  @MinLength(8)
  @Type(() => String)
  public readonly password: string
}
