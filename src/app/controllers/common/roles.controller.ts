import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { RolesService } from '@app/services/common'
import { CreateRoleDto } from '@app/dto/common'

import { Role } from '@infrastructure/entities/common'

import { JwtAuthGuard } from '@common/guards/authorization'
import { Roles } from '@common/decorators'
import { RolesEnum } from '@common/constants'
import { RolesGuard } from '@common/guards/common'

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
