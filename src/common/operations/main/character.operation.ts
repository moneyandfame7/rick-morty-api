import { HttpStatus, UseGuards } from '@nestjs/common'

import { Character } from '@infrastructure/entities/main'

import { BaseOperationOptions, MainEntitiesOperations } from '@common/operations'
import { HttpMethod, ROLES } from '@common/constants'
import { Roles } from '@common/decorators'
import { JwtAuthGuard } from '@common/guards/authorization'
import { RolesGuard } from '@common/guards/common'

interface CharacterOtherOperations {
  GET_IMAGES: BaseOperationOptions
}
type CharacterOperations = MainEntitiesOperations & CharacterOtherOperations
export const CHARACTER_OPERATION: CharacterOperations = {
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
  GET_NAMES: {
    summary: 'get list of names',
    status: HttpStatus.OK,
    type: [String],
    method: HttpMethod.POST('/names'),
    guard: UseGuards(JwtAuthGuard)
  },
  GET_BY_FIELDS: {
    summary: 'get list of unique values by field',
    status: HttpStatus.OK,
    type: [String],
    method: HttpMethod.GET('/unique'),
    guard: UseGuards(JwtAuthGuard)
  },
  GET_ONE: {
    summary: 'get one character with specified id',
    status: HttpStatus.OK,
    type: Character,
    method: HttpMethod.GET(':id'),
    guard: UseGuards(JwtAuthGuard)
  },
  GET_COUNT: {
    summary: 'get count of characters',
    status: HttpStatus.OK,
    type: Number,
    method: HttpMethod.GET('/count'),
    guard: UseGuards()
  },
  GET_IMAGES: {
    summary: 'get list of characters images',
    status: HttpStatus.OK,
    type: [String],
    method: HttpMethod.GET('/images'),
    guard: UseGuards()
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
