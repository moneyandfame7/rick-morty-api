import { RolesEnum } from '@common/constants'
import { Roles } from '@common/decorators'
import { CustomDecorator } from '@nestjs/common'

export const getPrivelegedRoles = (): CustomDecorator => Roles(RolesEnum.ADMIN, RolesEnum.OWNER)
