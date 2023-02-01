import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { Request } from 'express'
import * as _ from 'lodash'
import { LocationService } from './location.service'
import { CreateLocationDto } from './dto/create-location.dto'
import { UpdateLocationDto } from './dto/update-location.dto'
import { QueryLocationDto } from './dto/query-location.dto'
import { Location } from './entities/location.entity'
import { JwtGuard } from '../auth/strategies/jwt/jwt.guard'

@Controller('locations')
@ApiTags('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'A new location is created.' })
  @ApiResponse({ status: 200, type: Location })
  @Post()
  async createOne(@Body() createLocationDto: CreateLocationDto) {
    return await this.locationService.createOne(createLocationDto)
  }

  @ApiOperation({ summary: 'This method returns the locations with the specified query, or returns all if the query is empty.' })
  @ApiResponse({ status: 200, type: [Location] })
  @Get()
  async getMany(@Query() query: QueryLocationDto, @Req() req: Request) {
    const pageOptionsDto = {
      take: query.take,
      page: query.page,
      order: query.order,
      skip: query.skip,
      otherQuery: req.originalUrl,
      endpoint: 'locations'
    }
    const queryLocationDto: any = _.omitBy(
      {
        id: query.id,
        name: query.name,
        type: query.type,
        dimension: query.dimension,
        resident_name: query.resident_name
      },
      _.isNil
    )
    return await this.locationService.getMany(pageOptionsDto, queryLocationDto as QueryLocationDto)
  }

  @ApiOperation({ summary: 'Returns the location by id.' })
  @ApiResponse({ status: 200, type: Location })
  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.locationService.getOne(id)
  }

  @ApiOperation({ summary: 'Updates the location with the specified body by id.' })
  @ApiResponse({ status: 200, type: Location })
  @Patch(':id')
  updateOne(@Param('id', ParseIntPipe) id: number, @Body() updateLocationDto: UpdateLocationDto) {
    return this.locationService.updateOne(id, updateLocationDto)
  }

  @ApiOperation({ summary: 'This method removes the location by id.' })
  @ApiResponse({ status: 200, type: Location })
  @Delete(':id')
  removeOne(@Param('id', ParseIntPipe) id: number) {
    return this.locationService.removeOne(id)
  }
}
