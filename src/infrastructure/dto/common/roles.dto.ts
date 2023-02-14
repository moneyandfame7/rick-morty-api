import { PartialType } from '@nestjs/swagger'
import { IsIn } from 'class-validator'

export class CreateRoleDto {
  @IsIn(['admin', 'user'])
  readonly value: string
}

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}
