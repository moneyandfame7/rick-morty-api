import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common'
import { CharacterService } from './character.service'

@Controller('characters')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body) {
    return this.characterService.create(body)
  }

  @Get('')
  async findAll(@Query() query) {
    return this.characterService.findAll()
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
