import { BaseOperations } from '@common/swagger/interface'
import { HttpStatus, UseGuards } from '@nestjs/common'

import { Role } from '@infrastructure/entities/common'

import { HttpMethod, ROLES } from '@common/constants'
import { Roles } from '@common/decorators'
import { JwtAuthGuard } from '@common/guards/authorization'
import { RolesGuard } from '@common/guards/common'

export const ROLE_OPERATION: Omit<BaseOperations, 'REMOVE' | 'UPDATE'> = {
  CREATE: {
    summary: 'create and save a new role to collection',
    status: HttpStatus.CREATED,
    type: Role,
    method: HttpMethod.POST(''),
    role: Roles(ROLES.ADMIN),
    guard: UseGuards(JwtAuthGuard, RolesGuard)
  },
  GET_MANY: {
    summary: 'get all roles',
    status: HttpStatus.OK,
    type: [Role],
    method: HttpMethod.GET(''),
    guard: UseGuards(JwtAuthGuard)
  },
  GET_ONE: {
    summary: 'get one role with specified value',
    status: HttpStatus.OK,
    type: Role,
    method: HttpMethod.GET(':value'),
    guard: UseGuards(JwtAuthGuard)
  }
}
