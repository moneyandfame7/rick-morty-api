import {
    Body,
    Controller,
    Param,
    ParseIntPipe,
    Query,
    Req,
    UploadedFile,
    UseInterceptors,
    ValidationPipe
} from '@nestjs/common'
import {ApiTags} from '@nestjs/swagger'
import {FileInterceptor} from '@nestjs/platform-express'
import type {Request} from 'express'
import * as _ from 'lodash'
import {memoryStorage} from 'multer'

import {CharacterService} from '@app/services/main'
import {CreateCharacterDto, FieldsCharacterDto, QueryCharacterDto, UpdateCharacterDto} from '@app/dto/main'
import {QueryPaginationDto} from '@app/dto/common'

import type {Presenter} from '@core/services/common'

import {Character} from '@infrastructure/entities/main'

import {CHARACTER_OPERATION} from '@common/swagger/main'
import {ApiEntitiesOperation} from '@common/decorators'

@Controller('/api/characters')
@ApiTags('characters')
export class CharacterController {
    public constructor(private readonly characterService: CharacterService) {
    }

    @ApiEntitiesOperation(CHARACTER_OPERATION.CREATE)
    @UseInterceptors(FileInterceptor('image', {storage: memoryStorage()}))
    public createOne(@Body() character: CreateCharacterDto, @UploadedFile() file: Express.Multer.File): Promise<Character> {
        return this.characterService.createOne(character, file)
    }

    @ApiEntitiesOperation(CHARACTER_OPERATION.GET_NAMES)
    public getNameList(): Promise<string[]> {
        return this.characterService.getNameList()
    }

    @ApiEntitiesOperation(CHARACTER_OPERATION.GET_BY_FIELDS)
    public getUniqueByFields(@Body() dto: FieldsCharacterDto): Promise<{ [field: string]: string[] }> {
        return this.characterService.getUniqueByFields(dto.fields)
    }

    @ApiEntitiesOperation(CHARACTER_OPERATION.GET_MANY)
    public getMany(@Query(new ValidationPipe({transform: true})) query: QueryCharacterDto, @Req() req: Request): Promise<Presenter<Character>> {
        const queryPaginationDto: QueryPaginationDto = {
            take: query.take,
            page: query.page,
            order: query.order,
            skip: query.skip,
            otherQuery: req.originalUrl.split('?')[1],
            endpoint: 'characters'
        }
        const queryCharacterDto = _.omitBy(
            {
                id: query.id,
                name: query.name,
                status: query.status,
                species: query.species,
                type: query.type,
                gender: query.gender,
                episode_name: query.episode_name
            },
            _.isNil
        )
        return this.characterService.getMany(queryPaginationDto, queryCharacterDto as QueryCharacterDto)
    }

    @ApiEntitiesOperation(CHARACTER_OPERATION.GET_ONE)
    public getOne(@Param('id', ParseIntPipe) id: number): Promise<Character> {
        return this.characterService.getOne(id)
    }

    @ApiEntitiesOperation(CHARACTER_OPERATION.UPDATE)
    public updateOne(@Param('id', ParseIntPipe) id: number, @Body() updateCharacterDto: UpdateCharacterDto): Promise<Character> {
        return this.characterService.updateOne(id, updateCharacterDto)
    }

    @ApiEntitiesOperation(CHARACTER_OPERATION.REMOVE)
    public removeOne(@Param('id', ParseIntPipe) id: number): Promise<Character> {
        return this.characterService.removeOne(id)
    }
}
