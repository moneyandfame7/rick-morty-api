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
  Query
} from '@nestjs/common'
import { CharacterService } from './character.service'
import { CreateCharacterDto } from './dto/create-character.dto'
import { UpdateCharacterDto } from './dto/update-character.dto'

@Controller('characters')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() character: CreateCharacterDto) {
    return this.characterService.create(character)
  }

  @Get('/')
  async findAll(@Query() query) {
    return this.characterService.findAll(query)
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
