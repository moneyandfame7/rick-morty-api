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

@Controller('characters')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  /**
   * A new character is created and an image is uploaded to the S3 Bucket.
   * */
  @Post()
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  async createOne(@Body() character: CreateCharacterDto, @UploadedFile() file: Express.Multer.File) {
    return await this.characterService.createOne(character, file)
  }

  /**
   * This method returns the characters with the specified query, or returns all if the query is empty.
   * */
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

  /**
   * This method returns the character by id.
   * */
  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return await this.characterService.getOne(id)
  }

  /**
   * This method updates the character with the specified body by id.
   **/
  @Patch(':id')
  async updateOne(@Param('id', ParseIntPipe) id: number, @Body() updateCharacterDto: UpdateCharacterDto) {
    return this.characterService.updateOne(id, updateCharacterDto)
  }

  /**
   * This method removes the character by id.
   **/
  @Delete(':id')
  removeOne(@Param('id', ParseIntPipe) id: number) {
    return this.characterService.removeOne(id)
  }
}
