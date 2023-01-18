import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UsePipes
} from '@nestjs/common'
import { CharacterService } from './character.service'
import { CreateCharacterDto } from './dto/create-character.dto'
import { UpdateCharacterDto } from './dto/update-character.dto'
import { Request } from 'express'
import { pagination } from '../utils/pagination'
import { QueryCharacterDto } from './dto/query-character.dto'
import { CharacterQueryPipe } from './character-query.pipe'

@Controller('characters')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() character: CreateCharacterDto) {
    return this.characterService.create(character)
  }

  @Get('/')
  @UsePipes(new CharacterQueryPipe())
  async findAll(
    @Query()
    queryDto: QueryCharacterDto,
    @Req() req: Request
  ) {
    const { characters, count } = await this.characterService.findAll(queryDto)
    return pagination(
      {
        page: Number(req.query.page),
        otherQuery: req.originalUrl,
        count: count,
        take: queryDto.take
      },
      characters,
      'characters'
    )
  }

  @Get('/episode/:id')
  async findAllByEpisode(@Param('id', ParseIntPipe) id: number) {
    return this.characterService.findAllByEpisode(+id)
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
