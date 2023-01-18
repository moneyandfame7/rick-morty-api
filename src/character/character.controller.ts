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
  Req
} from '@nestjs/common'
import { CharacterService } from './character.service'
import { CreateCharacterDto } from './dto/create-character.dto'
import { UpdateCharacterDto } from './dto/update-character.dto'
import { Request } from 'express'
import { pagination } from '../utils/pagination'
import { QueryDto } from './dto/query.dto'
import filterData from '../common/filter-data'

@Controller('characters')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() character: CreateCharacterDto) {
    return this.characterService.create(character)
  }

  @Get('/')
  async findAll(@Query() queryDto: QueryDto, @Req() req: Request) {
    const filters = filterData(queryDto as any, 'Character')
    console.log(filters)
    console.log(queryDto, '<<<< DTO')
    const [characters, count] = await this.characterService.findAll(filters)

    return pagination(
      {
        page: Number(req.query.page),
        otherQuery: req.originalUrl,
        count: count,
        take: queryDto.take || 20
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
