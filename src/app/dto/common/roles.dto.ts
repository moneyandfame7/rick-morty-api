import { PartialType } from '@nestjs/swagger'
import { IsEnum } from 'class-validator'

import { ROLES } from '@common/constants'

export class CreateRoleDto {
  @IsEnum(ROLES)
  public readonly value: string
}

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}
