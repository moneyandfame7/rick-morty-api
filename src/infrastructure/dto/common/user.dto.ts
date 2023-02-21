import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsBoolean, IsEmail, IsEnum, IsIn, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator'
import { Type } from 'class-transformer'
import { RolesEnum } from '@common/constants/roles.enum'

export class CreateUserDto {
  @ApiProperty({ example: 'User_228', description: 'The username of the user.' })
  @MinLength(2)
  @MaxLength(20)
  @IsNotEmpty()
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
  readonly password?: string

  @IsIn(['google', 'instagram', 'discord', 'github', 'jwt'])
  readonly auth_type: string

  @IsOptional()
  readonly photo?: string

  @IsUUID()
  @IsOptional()
  readonly verify_link?: string

  @IsBoolean()
  readonly is_verified?: boolean = false

  @IsBoolean()
  readonly mail_subscribe?: boolean

  @IsString()
  readonly country?: string
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class AddRoleDto {
  @IsEnum(RolesEnum)
  readonly value: RolesEnum

  @IsUUID()
  readonly userId: string
}

export class BanUserDto {
  @IsUUID()
  readonly userId: string

  @IsNotEmpty()
  readonly banReason: string
}

export class SetUsernameDto {
  @MinLength(2)
  @MaxLength(20)
  @Type(() => String)
  @IsNotEmpty()
  username: string
}

export class EmailDto {
  @IsEmail()
  email: string
}

export class ResetPasswordDto {
  @MinLength(3)
  @MaxLength(32)
  @Type(() => String)
  password: string
}

export class UserDetailsDto {
  @MinLength(2)
  @MaxLength(20)
  @Type(() => String)
  @IsNotEmpty()
  username: string

  @IsBoolean()
  mail_subscribe: boolean

  @IsNotEmpty()
  country: string
}
