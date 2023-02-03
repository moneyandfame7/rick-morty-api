import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { RolesService } from './roles.service'
import { CreateRoleDto } from './dto/create-role.dto'

@Controller('api/roles')
@ApiTags('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    return await this.rolesService.createRole(createRoleDto)
  }

  @Get()
  async getManyRoles() {
    return await this.rolesService.getMany()
  }

  @Get('/:value')
  async getRole(@Param('value') value: string) {
    return await this.rolesService.getRole(value)
  }
}
