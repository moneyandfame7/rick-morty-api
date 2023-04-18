import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsBoolean, IsEmail, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Length, MaxLength, MinLength } from 'class-validator'
import { Type } from 'class-transformer'

import { AUTHORIZATION_PROVIDER, RolesEnum } from '@common/constants'

export class CreateUserDto {
  @ApiProperty({ example: 'User_228', description: 'The username of the user.' })
  @MinLength(6)
  @MaxLength(32)
  @Type(() => String)
  public readonly username?: string

  @ApiProperty({ example: 'user@gmail.com', description: 'The email of the user.' })
  @IsEmail()
  public readonly email: string

  @ApiProperty({
    example: '$2b$05$oSq9tOJGxOvmDpj7KLaJP.t0BGI6ic4OrOSCf/493ZsG9z/JoC3ki',
    description: 'The hashed password of the user.'
  })
  @MinLength(8)
  @MaxLength(20)
  @Type(() => String)
  public readonly password?: string

  @IsEnum(AUTHORIZATION_PROVIDER)
  public readonly auth_type: string

  @IsOptional()
  public readonly photo?: string

  @IsUUID()
  @IsOptional()
  public readonly verify_link?: string

  @IsBoolean()
  public readonly is_verified?: boolean = false

  @IsBoolean()
  public readonly mail_subscribe?: boolean

  @IsString()
  @Length(2, 2)
  public readonly country?: string
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class AddRoleDto {
  @IsEnum(RolesEnum)
  public readonly value: RolesEnum

  @IsUUID()
  public readonly userId: string
}

export class UserQueryDto {
  @Type(() => Number)
  @IsInt()
  public readonly page: number = 1

  @Type(() => Number)
  @IsInt()
  public readonly pageSize: number = 20
}

export class BanUserDto {
  @IsUUID(undefined, { message: 'Invalid user id' })
  public readonly userId: string

  @IsNotEmpty({ message: 'Specify the reason for the ban' })
  public readonly banReason: string
}

export class EmailDto {
  @IsEmail()
  public email: string
}

export class ResetPasswordDto {
  @MinLength(8)
  @MaxLength(20)
  @Type(() => String)
  public readonly password: string

  @MinLength(8)
  @MaxLength(20)
  @Type(() => String)
  public readonly confirmPassword: string
}

export class UserDetailsDto {
  @MinLength(2)
  @MaxLength(32)
  @Type(() => String)
  @IsNotEmpty()
  public username: string

  @IsBoolean()
  @Type(() => Boolean)
  public mail_subscribe: boolean

  @IsNotEmpty()
  @IsString()
  public country: string
}
