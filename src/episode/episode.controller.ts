import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req } from '@nestjs/common'
import { Request } from 'express'
import * as _ from 'lodash'
import { EpisodeService } from './episode.service'
import { CreateEpisodeDto } from './dto/create-episode.dto'
import { UpdateEpisodeDto } from './dto/update-episode.dto'
import { QueryEpisodeDto } from './dto/query-episode.dto'

@Controller('episodes')
export class EpisodeController {
  constructor(private readonly episodeService: EpisodeService) {}

  @Post()
  async createOne(@Body() createEpisodeDto: CreateEpisodeDto) {
    return await this.episodeService.createOne(createEpisodeDto)
  }

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

  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return await this.episodeService.getOne(id)
  }

  @Patch(':id')
  async updateOne(@Param('id', ParseIntPipe) id: number, @Body() updateEpisodeDto: UpdateEpisodeDto) {
    return await this.episodeService.updateOne(id, updateEpisodeDto)
  }

  @Delete(':id')
  async removeOne(@Param('id', ParseIntPipe) id: number) {
    return await this.episodeService.removeOne(id)
  }
}
