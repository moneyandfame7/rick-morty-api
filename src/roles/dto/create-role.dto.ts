import { IsIn } from 'class-validator'

export class CreateRoleDto {
  @IsIn(['admin', 'user'])
  readonly value: string
}
