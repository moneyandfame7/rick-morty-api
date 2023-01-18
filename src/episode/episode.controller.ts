import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req } from '@nestjs/common'
import { EpisodeService } from './episode.service'
import { CreateEpisodeDto } from './dto/create-episode.dto'
import { UpdateEpisodeDto } from './dto/update-episode.dto'
import { EpisodeQueryPipe } from './episode-query.pipe'
import { QueryEpisodeDto } from './dto/query-episode.dto'
import { Request } from 'express'
import { pagination } from '../utils/pagination'

@Controller('episodes')
export class EpisodeController {
  constructor(private readonly episodeService: EpisodeService) {}

  @Post()
  create(@Body() createEpisodeDto: CreateEpisodeDto) {
    return this.episodeService.create(createEpisodeDto)
  }

  @Get()
  async findAll(@Query(EpisodeQueryPipe) queryDto: QueryEpisodeDto, @Req() req: Request) {
    const { episodes, count } = await this.episodeService.findAll(queryDto)
    return pagination(
      {
        page: Number(req.query.page),
        otherQuery: req.originalUrl,
        count: count,
        take: queryDto.take
      },
      episodes,
      'episodes'
    )
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.episodeService.findOne(id)
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateEpisodeDto: UpdateEpisodeDto) {
    return this.episodeService.update(id, updateEpisodeDto)
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.episodeService.remove(id)
  }
}
