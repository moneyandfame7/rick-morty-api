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
  async create(@Body() createEpisodeDto: CreateEpisodeDto) {
    return await this.episodeService.create(createEpisodeDto)
  }

  @Get()
  async findAll(@Query() query: QueryEpisodeDto, @Req() req: Request) {
    const pageOptionsDto = {
      take: query.take,
      page: query.page,
      order: query.order,
      skip: query.skip,
      otherQuery: req.originalUrl
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
    return await this.episodeService.findAll(pageOptionsDto, queryEpisodeDto as QueryEpisodeDto)
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.episodeService.findOne(id)
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateEpisodeDto: UpdateEpisodeDto) {
    return await this.episodeService.update(id, updateEpisodeDto)
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.episodeService.remove(id)
  }
}
