import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common'
import { dataSourceOptions } from 'db/data-source'
import { CharacterService } from './character.service'

@Controller('characters')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body) {
    return this.characterService.create(body)
  }

  // @Get()
  // findAll(@Query() query: any, @Param() param: any) {
  //   console.log(query, ' << QUERY')
  //   return this.characterService.findAll()
  // }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.characterService.findOne(+id)
  }
  @Get('')
  test() {
    return dataSourceOptions
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
