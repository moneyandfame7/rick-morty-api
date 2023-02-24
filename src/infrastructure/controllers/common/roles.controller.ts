import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { RolesService } from '@services/common/roles.service'
import { CreateRoleDto } from '@dto/common/roles.dto'
import { JwtAuthGuard } from '@common/guards/auth/jwt.guard'
import { Roles } from '@common/decorators/roles.decorator'
import { RolesEnum } from '@common/constants/roles.enum'
import { RolesGuard } from '@common/guards/roles.guard'
import type { Role } from '@entities/common/role.entity'

@Controller('api/roles')
@ApiTags('roles')
export class RolesController {
  public constructor(private readonly rolesService: RolesService) {}

  @Post()
  @Roles(RolesEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  public async create(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return this.rolesService.createRole(createRoleDto)
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  public async getMany(): Promise<Role[]> {
    return this.rolesService.getMany()
  }

  @Get('/:value')
  @UseGuards(JwtAuthGuard)
  public async getOne(@Param('value') value: string): Promise<Role> {
    return this.rolesService.getOne(value)
  }
}
