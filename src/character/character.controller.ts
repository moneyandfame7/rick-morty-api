import {
  Body,
  ClassSerializerInterceptor,
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
  UseInterceptors
} from '@nestjs/common'
import { CharacterService } from './character.service'
import { CreateCharacterDto } from './dto/create-character.dto'
import { UpdateCharacterDto } from './dto/update-character.dto'
import { PageOptionsDto } from '../common/page-info/dto/page-options.dto'

@Controller('characters')
@UseInterceptors(ClassSerializerInterceptor)
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Post()
  create(@Body() character: CreateCharacterDto) {
    return this.characterService.create(character)
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    return await this.characterService.findAll(pageOptionsDto)
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
