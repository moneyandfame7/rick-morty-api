import { Body, Controller, Param } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { RolesService } from '@app/services/common'
import { CreateRoleDto } from '@infrastructure/dto/common'

import { Role } from '@infrastructure/entities/common'

import { ROLE_OPERATION } from '@common/operations/common'
import { ApiEntitiesOperation } from '@common/decorators'

@Controller('api/roles')
@ApiTags('roles')
export class RolesController {
  public constructor(private readonly rolesService: RolesService) {}

  @ApiEntitiesOperation(ROLE_OPERATION.CREATE)
  public async create(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return this.rolesService.createRole(createRoleDto)
  }

  @ApiEntitiesOperation(ROLE_OPERATION.GET_MANY)
  public async getMany(): Promise<Role[]> {
    return this.rolesService.getMany()
  }

  @ApiEntitiesOperation(ROLE_OPERATION.GET_ONE)
  public async getOne(@Param('value') value: string): Promise<Role> {
    return this.rolesService.getOne(value)
  }
}
