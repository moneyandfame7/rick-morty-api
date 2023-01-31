import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Request } from 'express'
import * as _ from 'lodash'
import { memoryStorage } from 'multer'
import { CharacterService } from './character.service'
import { CreateCharacterDto } from './dto/create-character.dto'
import { UpdateCharacterDto } from './dto/update-character.dto'
import { QueryCharacterDto } from './dto/query-character.dto'
import { PageOptionsDto } from '../shared/page-info/dto/page-options.dto'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { Character } from './entities/character.entity'

@Controller('characters')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @ApiOperation({ summary: 'A new character is created and an image is uploaded to the S3 Bucket.' })
  @ApiResponse({ status: 200, type: Character })
  @Post()
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  async createOne(@Body() character: CreateCharacterDto, @UploadedFile() file: Express.Multer.File) {
    return await this.characterService.createOne(character, file)
  }

  @ApiOperation({ summary: 'This method returns the characters with the specified query, or returns all if the query is empty.' })
  @ApiResponse({ status: 200, type: [Character] })
  @Get()
  async getMany(@Query() query: QueryCharacterDto, @Req() req: Request) {
    const pageOptionsDto: PageOptionsDto = {
      take: query.take,
      page: query.page,
      order: query.order,
      skip: query.skip,
      otherQuery: req.originalUrl.split('/')[2],
      endpoint: 'characters'
    }
    const queryCharacterDto: any = _.omitBy(
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
    return await this.characterService.getMany(pageOptionsDto, queryCharacterDto as QueryCharacterDto)
  }

  @ApiOperation({ summary: 'Returns the character by id.' })
  @ApiResponse({ status: 200, type: Character })
  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return await this.characterService.getOne(id)
  }

  @ApiOperation({ summary: 'Updates the character with the specified body by id.' })
  @ApiResponse({ status: 200, type: Character })
  @Patch(':id')
  async updateOne(@Param('id', ParseIntPipe) id: number, @Body() updateCharacterDto: UpdateCharacterDto) {
    return this.characterService.updateOne(id, updateCharacterDto)
  }

  @ApiOperation({ summary: 'This method removes the character by id.' })
  @ApiResponse({ status: 200, type: Character })
  @Delete(':id')
  removeOne(@Param('id', ParseIntPipe) id: number) {
    return this.characterService.removeOne(id)
  }
}
