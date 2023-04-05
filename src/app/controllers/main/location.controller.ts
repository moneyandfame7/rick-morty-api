import { Body, Controller, Param, ParseIntPipe, Query, Req, ValidationPipe } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import type { Request } from 'express'
import * as _ from 'lodash'

import { LocationService } from '@app/services/main'
import { CreateLocationDto, FieldsLocationDto, QueryLocationDto, UpdateLocationDto } from '@app/dto/main'
import { QueryPaginationDto } from '@app/dto/common'

import type { Presenter } from '@core/services/common'

import { Location } from '@infrastructure/entities/main'

import { LOCATION_OPERATION } from '@common/operations/main'
import { ApiEntitiesOperation } from '@common/decorators'

@Controller('/api/locations')
@ApiTags('/locations')
export class LocationController {
  public constructor(private readonly locationService: LocationService) {}

  @ApiEntitiesOperation(LOCATION_OPERATION.CREATE)
  public async createOne(@Body() createLocationDto: CreateLocationDto): Promise<Location> {
    return this.locationService.createOne(createLocationDto)
  }

  @ApiEntitiesOperation(LOCATION_OPERATION.GET_NAMES)
  public getNameList(@Body('name') name: string): Promise<string[]> {
    return this.locationService.getNameList(name)
  }

  /*@Get('/count')*/
  @ApiEntitiesOperation(LOCATION_OPERATION.GET_COUNT)
  public async getCount(): Promise<number> {
    return this.locationService.getCount()
  }

  @ApiEntitiesOperation(LOCATION_OPERATION.GET_BY_FIELDS)
  public getUniqueByFields(@Body() dto: FieldsLocationDto): Promise<{ [field: string]: string[] }> {
    return this.locationService.getUniqueByFields(dto.fields)
  }

  @ApiEntitiesOperation(LOCATION_OPERATION.GET_MANY)
  public async getMany(@Query(new ValidationPipe({ transform: true })) query: QueryLocationDto, @Req() req: Request): Promise<Presenter<Location>> {
    const queryPaginationDto: QueryPaginationDto = {
      take: query.take,
      page: query.page,
      order: query.order,
      skip: query.skip,
      otherQuery: req.originalUrl.split('?')[1],
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

  @ApiEntitiesOperation(LOCATION_OPERATION.GET_ONE)
  public async getOne(@Param('id', ParseIntPipe) id: number): Promise<Location> {
    return this.locationService.getOne(id)
  }

  /*@ApiEntitiesOperation(LOCATION_OPERATION.GET_COUNT)*/

  @ApiEntitiesOperation(LOCATION_OPERATION.UPDATE)
  public async updateOne(@Param('id', ParseIntPipe) id: number, @Body() updateLocationDto: UpdateLocationDto): Promise<Location> {
    return this.locationService.updateOne(id, updateLocationDto)
  }

  @ApiEntitiesOperation(LOCATION_OPERATION.REMOVE)
  public async removeOne(@Param('id', ParseIntPipe) id: number): Promise<Location> {
    return this.locationService.removeOne(id)
  }
}
