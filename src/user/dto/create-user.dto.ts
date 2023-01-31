import { IsEmail, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
  @ApiProperty({ example: 'user@gmail.com', description: 'The email of the user.' })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string

  @ApiProperty({ example: 'qwerty12345678', description: 'The password of the user.' })
  @IsNotEmpty()
  readonly password: string
}
