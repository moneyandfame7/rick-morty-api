import {Body, Controller, Param, ParseIntPipe, Query, Req, ValidationPipe} from '@nestjs/common'
import {ApiTags} from '@nestjs/swagger'
import type {Request} from 'express'
import * as _ from 'lodash'

import {EpisodeService} from '@app/services/main'

import {CreateEpisodeDto, FieldsEpisodeDto, QueryEpisodeDto, UpdateEpisodeDto} from '@app/dto/main'
import {QueryPaginationDto} from '@app/dto/common'

import type {Presenter} from '@core/services/common'

import {Episode} from '@infrastructure/entities/main'

import {EPISODE_OPERATION} from '@common/swagger/main'
import {ApiEntitiesOperation} from '@common/decorators'

@Controller('/api/episodes')
@ApiTags('/episodes')
export class EpisodeController {
    public constructor(private readonly episodeService: EpisodeService) {
    }

    @ApiEntitiesOperation(EPISODE_OPERATION.CREATE)
    public async createOne(@Body() createEpisodeDto: CreateEpisodeDto): Promise<Episode> {
        return this.episodeService.createOne(createEpisodeDto)
    }

    @ApiEntitiesOperation(EPISODE_OPERATION.GET_NAMES)
    public getNameList(@Body('name') name: string): Promise<string[]> {
        return this.episodeService.getNameList(name)
    }

    @ApiEntitiesOperation(EPISODE_OPERATION.GET_BY_FIELDS)
    public getUniqueByFields(@Body() dto: FieldsEpisodeDto): Promise<{ [field: string]: string[] }> {
        return this.episodeService.getUniqueByFields(dto.fields)
    }

    @ApiEntitiesOperation(EPISODE_OPERATION.GET_MANY)
    public async getMany(@Query(new ValidationPipe({transform: true})) query: QueryEpisodeDto, @Req() req: Request): Promise<Presenter<Episode>> {
        const queryPaginationDto: QueryPaginationDto = {
            take: query.take,
            page: query.page,
            order: query.order,
            skip: query.skip,
            otherQuery: req.originalUrl.split('?')[1],
            endpoint: 'episodes'
        }
        const queryEpisodeDto = _.omitBy(
            {
                id: query.id,
                name: query.name,
                episode: query.episode,
                character_name: query.character_name
            },
            _.isNil
        )
        return this.episodeService.getMany(queryPaginationDto, queryEpisodeDto as QueryEpisodeDto)
    }

    @ApiEntitiesOperation(EPISODE_OPERATION.GET_ONE)
    public async getOne(@Param('id', ParseIntPipe) id: number): Promise<Episode> {
        return this.episodeService.getOne(id)
    }

    @ApiEntitiesOperation(EPISODE_OPERATION.UPDATE)
    public async updateOne(@Param('id', ParseIntPipe) id: number, @Body() updateEpisodeDto: UpdateEpisodeDto): Promise<Episode> {
        return this.episodeService.updateOne(id, updateEpisodeDto)
    }

    @ApiEntitiesOperation(EPISODE_OPERATION.REMOVE)
    public async removeOne(@Param('id', ParseIntPipe) id: number): Promise<Episode> {
        return this.episodeService.removeOne(id)
    }
}
