import {HttpStatus, UseGuards} from '@nestjs/common'

import {Episode} from '@infrastructure/entities/main'

import {MainEntitiesOperations} from '@common/swagger'
import {HttpMethod, ROLES} from '@common/constants'
import {Roles} from '@common/decorators'
import {JwtAuthGuard} from '@common/guards/authorization'
import {RolesGuard} from '@common/guards/common'

export const EPISODE_OPERATION: MainEntitiesOperations = {
    CREATE: {
        summary: 'create and save a new episode to collection',
        status: HttpStatus.CREATED,
        type: Episode,
        method: HttpMethod.POST(''),
        role: Roles(ROLES.ADMIN),
        guard: UseGuards(JwtAuthGuard, RolesGuard)
    },
    GET_MANY: {
        summary: 'get all episodes by queries',
        status: HttpStatus.OK,
        type: [Episode],
        method: HttpMethod.GET(''),
        guard: UseGuards(JwtAuthGuard)
    },
    GET_NAMES: {
        summary: 'get list of names',
        status: HttpStatus.OK,
        type: [String],
        method: HttpMethod.GET('/names'),
        guard: UseGuards(JwtAuthGuard)
    },
    GET_ONE: {
        summary: 'get one episode with specified id',
        status: HttpStatus.OK,
        type: Episode,
        method: HttpMethod.GET(':id'),
        guard: UseGuards(JwtAuthGuard)
    },
    UPDATE: {
        summary: 'update one episode with specified id',
        status: HttpStatus.OK,
        type: Episode,
        method: HttpMethod.PATCH(':id'),
        role: Roles(ROLES.ADMIN),
        guard: UseGuards(JwtAuthGuard, RolesGuard)
    },
    REMOVE: {
        summary: 'remove one episode with specified id',
        status: HttpStatus.OK,
        type: Episode,
        method: HttpMethod.DELETE(':id'),
        role: Roles(ROLES.ADMIN),
        guard: UseGuards(JwtAuthGuard, RolesGuard)
    }
}
