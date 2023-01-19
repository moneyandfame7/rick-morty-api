import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseInterceptors
} from '@nestjs/common'
import * as _ from 'lodash'
import { CharacterService } from './character.service'
import { CreateCharacterDto } from './dto/create-character.dto'
import { UpdateCharacterDto } from './dto/update-character.dto'
import { QueryCharacterDto } from './dto/query-character.dto'

@Controller('characters')
@UseInterceptors(ClassSerializerInterceptor)
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Post()
  create(@Body() character: CreateCharacterDto) {
    return this.characterService.create(character)
  }

  @Get()
  async findAll(@Query() query: QueryCharacterDto) {
    console.log(query)
    const pageOptionsDto = { take: query.take, page: query.page, order: query.order, skip: query.skip }
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
    return await this.characterService.findAll(pageOptionsDto, queryCharacterDto as QueryCharacterDto)
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.characterService.findOne(id)
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCharacterDto: UpdateCharacterDto) {
    return this.characterService.update(id, updateCharacterDto)
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.characterService.remove(id)
  }
}
