import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { RolesService } from '../../services/common/roles.service'
import { CreateRoleDto } from '../../dto/common/roles.dto'
import { JwtAuthGuard } from '../../common/guards/auth/jwt.guard'
import { Roles } from '../../common/decorators/roles.decorator'
import { RolesEnum } from '../../common/constants/roles.enum'
import { RolesGuard } from '../../common/guards/roles.guard'

@Controller('api/roles')
@ApiTags('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @Roles(RolesEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(@Body() createRoleDto: CreateRoleDto) {
    return await this.rolesService.createRole(createRoleDto)
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getManyRoles() {
    return await this.rolesService.getMany()
  }

  @Get('/:value')
  @UseGuards(JwtAuthGuard)
  async getRole(@Param('value') value: string) {
    return await this.rolesService.getRole(value)
  }
}
