import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req } from '@nestjs/common'
import { Request } from 'express'
import * as _ from 'lodash'
import { LocationService } from './location.service'
import { CreateLocationDto } from './dto/create-location.dto'
import { UpdateLocationDto } from './dto/update-location.dto'
import { QueryLocationDto } from './dto/query-location.dto'

@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  async createOne(@Body() createLocationDto: CreateLocationDto) {
    return await this.locationService.createOne(createLocationDto)
  }

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

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.locationService.getOne(id)
  }

  @Patch(':id')
  updateOne(@Param('id', ParseIntPipe) id: number, @Body() updateLocationDto: UpdateLocationDto) {
    return this.locationService.updateOne(id, updateLocationDto)
  }

  @Delete(':id')
  removeOne(@Param('id', ParseIntPipe) id: number) {
    return this.locationService.removeOne(id)
  }
}
