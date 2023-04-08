import { PartialType } from '@nestjs/swagger'
import { IsEnum } from 'class-validator'

import { RolesEnum } from '@common/constants'

export class CreateRoleDto {
  @IsEnum(RolesEnum)
  public readonly value: string
}

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}
