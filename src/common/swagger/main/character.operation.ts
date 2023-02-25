import { HttpStatus, UseGuards } from '@nestjs/common'

import { Character } from '@infrastructure/entities/main'

import { BaseOperations } from '@common/swagger'
import { HttpMethod, ROLES } from '@common/constants'
import { Roles } from '@common/decorators'
import { JwtAuthGuard } from '@common/guards/authorization'
import { RolesGuard } from '@common/guards/common'

export const CHARACTER_OPERATION: BaseOperations = {
  CREATE: {
    summary: 'create and save a new character to collection',
    status: HttpStatus.CREATED,
    type: Character,
    method: HttpMethod.POST(''),
    role: Roles(ROLES.ADMIN),
    guard: UseGuards(JwtAuthGuard, RolesGuard)
  },
  GET_MANY: {
    summary: 'get all characters by queries',
    status: HttpStatus.OK,
    type: [Character],
    method: HttpMethod.GET(''),
    guard: UseGuards(JwtAuthGuard)
  },
  GET_ONE: {
    summary: 'get one character with specified id',
    status: HttpStatus.OK,
    type: Character,
    method: HttpMethod.GET(':id'),
    guard: UseGuards(JwtAuthGuard)
  },
  UPDATE: {
    summary: 'update one character with specified id',
    status: HttpStatus.OK,
    type: Character,
    method: HttpMethod.PATCH(':id'),
    role: Roles(ROLES.ADMIN),
    guard: UseGuards(JwtAuthGuard, RolesGuard)
  },
  REMOVE: {
    summary: 'remove one character with specified id',
    status: HttpStatus.OK,
    type: Character,
    method: HttpMethod.DELETE(':id'),
    role: Roles(ROLES.ADMIN),
    guard: UseGuards(JwtAuthGuard, RolesGuard)
  }
}
