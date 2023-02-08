import { IsEnum, IsUUID } from 'class-validator'
import { RolesEnum } from '../../roles/roles.enum'

export class AddRoleDto {
  @IsEnum(RolesEnum)
  readonly value: RolesEnum

  @IsUUID()
  readonly userId: string
}
