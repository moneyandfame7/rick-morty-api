import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req } from '@nestjs/common'
import { Request } from 'express'
import * as _ from 'lodash'
import { EpisodeService } from './episode.service'
import { CreateEpisodeDto } from './dto/create-episode.dto'
import { UpdateEpisodeDto } from './dto/update-episode.dto'
import { QueryEpisodeDto } from './dto/query-episode.dto'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { Episode } from './entities/episode.entity'

@Controller('episodes')
export class EpisodeController {
  constructor(private readonly episodeService: EpisodeService) {}

  @ApiOperation({ summary: 'A new episode is created.' })
  @ApiResponse({ status: 200, type: Episode })
  @Post()
  async createOne(@Body() createEpisodeDto: CreateEpisodeDto) {
    return await this.episodeService.createOne(createEpisodeDto)
  }

  @ApiOperation({ summary: 'This method returns the episodes with the specified query, or returns all if the query is empty.' })
  @ApiResponse({ status: 200, type: [Episode] })
  @Get()
  async getMany(@Query() query: QueryEpisodeDto, @Req() req: Request) {
    const pageOptionsDto = {
      take: query.take,
      page: query.page,
      order: query.order,
      skip: query.skip,
      otherQuery: req.originalUrl,
      endpoint: 'characters'
    }
    const queryEpisodeDto: any = _.omitBy(
      {
        id: query.id,
        name: query.name,
        episode: query.episode,
        character_name: query.character_name
      },
      _.isNil
    )
    return await this.episodeService.getMany(pageOptionsDto, queryEpisodeDto as QueryEpisodeDto)
  }

  @ApiOperation({ summary: 'Returns the episode by id.' })
  @ApiResponse({ status: 200, type: Episode })
  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return await this.episodeService.getOne(id)
  }

  @ApiOperation({ summary: 'Updates the episode with the specified body by id.' })
  @ApiResponse({ status: 200, type: Episode })
  @Patch(':id')
  async updateOne(@Param('id', ParseIntPipe) id: number, @Body() updateEpisodeDto: UpdateEpisodeDto) {
    return await this.episodeService.updateOne(id, updateEpisodeDto)
  }

  @ApiOperation({ summary: 'This method removes the episode by id.' })
  @ApiResponse({ status: 200, type: Episode })
  @Delete(':id')
  async removeOne(@Param('id', ParseIntPipe) id: number) {
    return await this.episodeService.removeOne(id)
  }
}
