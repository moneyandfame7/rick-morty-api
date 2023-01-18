import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UsePipes } from '@nestjs/common'
import { Request } from 'express'
import { LocationService } from './location.service'
import { CreateLocationDto } from './dto/create-location.dto'
import { UpdateLocationDto } from './dto/update-location.dto'
import { pagination } from '../utils/pagination'
import { QueryLocationDto } from './dto/query-location.dto'
import { LocationQueryPipe } from './location-query.pipe'

@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationService.create(createLocationDto)
  }

  @Get()
  @UsePipes(new LocationQueryPipe())
  async findAll(@Query() queryDto: QueryLocationDto, @Req() req: Request) {
    const { locations, count } = await this.locationService.findAll(queryDto)
    return pagination(
      {
        page: Number(req.query.page),
        otherQuery: req.originalUrl,
        count: count,
        take: queryDto.take
      },
      locations,
      'locations'
    )
  }

  @Get('/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.locationService.findOne(id)
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateLocationDto: UpdateLocationDto) {
    return this.locationService.update(id, updateLocationDto)
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.locationService.remove(id)
  }
}
