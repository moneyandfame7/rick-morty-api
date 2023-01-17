import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common'
import { CharacterService } from './character.service'
import { CreateCharacterDto } from './dto/create-character.dto'

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
  async findAllByEpisode(@Param('id') id: string) {
    return this.characterService.findAllByEpisode(+id)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.characterService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body) {
    return this.characterService.update(+id, body)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.characterService.remove(+id)
  }
}
