import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Request } from 'express'
import * as _ from 'lodash'
import { LocationService } from '@services/main/location.service'
import { CreateLocationDto, QueryLocationDto, UpdateLocationDto } from '@dto/main/location.dto'
import { Location } from '@entities/main/location.entity'
import { JwtAuthGuard } from '@common/guards/auth/jwt.guard'
import { Roles } from '@common/decorators/roles.decorator'
import { RolesEnum } from '@common/constants/roles.enum'
import { RolesGuard } from '@common/guards/roles.guard'
import type { Payload } from '@services/common/pagination.service'
import type { QueryPaginationDto } from '@dto/common/pagination.dto'

@Controller('api/locations')
@ApiTags('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  @ApiOperation({ summary: 'A new location is created.' })
  @ApiResponse({ status: 200, type: Location })
  @Roles(RolesEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  public async createOne(@Body() createLocationDto: CreateLocationDto): Promise<Location> {
    return this.locationService.createOne(createLocationDto)
  }

  @Get()
  @ApiOperation({
    summary: 'This method returns the locations with the specified query, or returns all if the query is empty.'
  })
  @ApiResponse({ status: 200, type: [Location] })
  @UseGuards(JwtAuthGuard)
  public async getMany(@Query() query: QueryLocationDto, @Req() req: Request): Promise<Payload<Location>> {
    const queryPaginationDto: QueryPaginationDto = {
      take: query.take,
      page: query.page,
      order: query.order,
      skip: query.skip,
      otherQuery: req.originalUrl,
      endpoint: 'locations'
    }
    const queryLocationDto = _.omitBy(
      {
        id: query.id,
        name: query.name,
        type: query.type,
        dimension: query.dimension,
        resident_name: query.resident_name
      },
      _.isNil
    )
    return this.locationService.getMany(queryPaginationDto, queryLocationDto as QueryLocationDto)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Returns the location by id.' })
  @ApiResponse({ status: 200, type: Location })
  @UseGuards(JwtAuthGuard)
  public async getOne(@Param('id', ParseIntPipe) id: number): Promise<Location> {
    return this.locationService.getOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Updates the location with the specified body by id.' })
  @ApiResponse({ status: 200, type: Location })
  @Roles(RolesEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  public async updateOne(@Param('id', ParseIntPipe) id: number, @Body() updateLocationDto: UpdateLocationDto): Promise<Location> {
    return this.locationService.updateOne(id, updateLocationDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'This method removes the location by id.' })
  @ApiResponse({ status: 200, type: Location })
  @Roles(RolesEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  public async removeOne(@Param('id', ParseIntPipe) id: number): Promise<Location> {
    return this.locationService.removeOne(id)
  }
}
