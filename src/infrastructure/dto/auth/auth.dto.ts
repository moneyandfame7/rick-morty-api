import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator'
import { Type } from 'class-transformer'

export class SignInDto {
  @IsEmail()
  email: string

  @IsNotEmpty()
  password: string
}

export class SignUpDto {
  @ApiProperty({ example: 'User_228', description: 'The username of the user.' })
  @MinLength(2)
  @MaxLength(20)
  @Type(() => String)
  readonly username: string

  @ApiProperty({ example: 'user@gmail.com', description: 'The email of the user.' })
  @IsEmail()
  readonly email: string

  @ApiProperty({
    example: '$2b$05$oSq9tOJGxOvmDpj7KLaJP.t0BGI6ic4OrOSCf/493ZsG9z/JoC3ki',
    description: 'The hashed password of the user.'
  })
  @MinLength(3)
  @MaxLength(32)
  @Type(() => String)
  readonly password: string

  @IsOptional()
  readonly photo?: string
}
