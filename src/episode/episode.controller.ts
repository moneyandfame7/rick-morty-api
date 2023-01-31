import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req } from '@nestjs/common'
import { Request } from 'express'
import * as _ from 'lodash'
import { EpisodeService } from './episode.service'
import { CreateEpisodeDto } from './dto/create-episode.dto'
import { UpdateEpisodeDto } from './dto/update-episode.dto'
import { QueryEpisodeDto } from './dto/query-episode.dto'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Episode } from './entities/episode.entity'

@Controller('episodes')
@ApiTags('episodes')
export class EpisodeController {
  constructor(private readonly episodeService: EpisodeService) {}

  @Post()
  @ApiOperation({ summary: 'create and save a new episode to collection' })
  @ApiResponse({ status: 200, type: Episode })
  async createOne(@Body() createEpisodeDto: CreateEpisodeDto) {
    return await this.episodeService.createOne(createEpisodeDto)
  }

  @Get()
  @ApiOperation({ summary: 'get all episodes by queries' })
  @ApiResponse({ status: 200, type: [Episode] })
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

  @Get(':id')
  @ApiOperation({ summary: 'get one episode with specified id' })
  @ApiResponse({ status: 200, type: Episode })
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return await this.episodeService.getOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'update one episode with specified id' })
  @ApiResponse({ status: 200, type: Episode })
  async updateOne(@Param('id', ParseIntPipe) id: number, @Body() updateEpisodeDto: UpdateEpisodeDto) {
    return await this.episodeService.updateOne(id, updateEpisodeDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'remove one episode with specified id' })
  @ApiResponse({ status: 200, type: Episode })
  async removeOne(@Param('id', ParseIntPipe) id: number) {
    return await this.episodeService.removeOne(id)
  }
}
