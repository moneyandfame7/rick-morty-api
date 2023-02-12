import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Request } from 'express'
import * as _ from 'lodash'
import { EpisodeService } from '../../services/main/episode.service'
import { CreateEpisodeDto, QueryEpisodeDto, UpdateEpisodeDto } from '../../dto/main/episode.dto'
import { Episode } from '../../entities/main/episode.entity'
import { Roles } from '../../common/decorators/roles.decorator'
import { RolesEnum } from '../../common/constants/roles.enum'
import { JwtAuthGuard } from '../../common/guards/auth/jwt.guard'
import { RolesGuard } from '../../common/guards/roles.guard'

@Controller('api/episodes')
@ApiTags('episodes')
export class EpisodeController {
  constructor(private readonly episodeService: EpisodeService) {}

  @Post()
  @ApiOperation({ summary: 'create and save a new episode to collection' })
  @ApiResponse({ status: 200, type: Episode })
  @Roles(RolesEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createOne(@Body() createEpisodeDto: CreateEpisodeDto) {
    return await this.episodeService.createOne(createEpisodeDto)
  }

  @Get()
  @ApiOperation({ summary: 'get all episodes by queries' })
  @ApiResponse({ status: 200, type: [Episode] })
  async getMany(@Query() query: QueryEpisodeDto, @Req() req: Request) {
    const queryPaginationDto = {
      take: query.take,
      page: query.page,
      order: query.order,
      skip: query.skip,
      otherQuery: req.originalUrl,
      endpoint: 'episodes'
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
    return await this.episodeService.getMany(queryPaginationDto, queryEpisodeDto as QueryEpisodeDto)
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
  @Roles(RolesEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateOne(@Param('id', ParseIntPipe) id: number, @Body() updateEpisodeDto: UpdateEpisodeDto) {
    return await this.episodeService.updateOne(id, updateEpisodeDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'remove one episode with specified id' })
  @ApiResponse({ status: 200, type: Episode })
  @Roles(RolesEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async removeOne(@Param('id', ParseIntPipe) id: number) {
    return await this.episodeService.removeOne(id)
  }
}
