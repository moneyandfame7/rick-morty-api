import { IsIn } from 'class-validator'
import { PartialType } from '@nestjs/swagger'

export class CreateRoleDto {
  @IsIn(['admin', 'user'])
  readonly value: string
}

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}
