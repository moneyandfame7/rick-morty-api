import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { RolesService } from './roles.service'
import { CreateRoleDto } from './dto/create-role.dto'

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    return await this.rolesService.createRole(createRoleDto)
  }

  @Get('/:value')
  async getRole(@Param('value') value: string) {
    console.log(value)
    return await this.rolesService.getRole(value)
  }
}
