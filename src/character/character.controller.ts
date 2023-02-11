import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Request } from 'express'
import * as _ from 'lodash'
import { memoryStorage } from 'multer'
import { CharacterService } from './character.service'
import { CreateCharacterDto } from './dto/create-character.dto'
import { UpdateCharacterDto } from './dto/update-character.dto'
import { QueryCharacterDto } from './dto/query-character.dto'
import { PageOptionsDto } from '../shared/page-info/dto/page-options.dto'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Character } from './entities/character.entity'
import { RolesEnum } from '../roles/roles.enum'
import { JwtAuthGuard } from '../auth/strategies/jwt/jwt.guard'
import { RolesGuard } from '../roles/roles.guard'
import { Roles } from '../roles/roles.decorator'

@Controller('api/characters')
@ApiTags('characters')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  //TODO: зробити form data tyt abo ni
  @Post()
  @ApiOperation({ summary: 'create and save a new character to collection' })
  @ApiResponse({ status: 200, type: Character })
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  @Roles(RolesEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createOne(@Body() character: CreateCharacterDto, @UploadedFile() file: Express.Multer.File) {
    return await this.characterService.createOne(character, file)
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'get all characters by queries' })
  @ApiResponse({ status: 200, type: [Character] })
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

  @Get(':id')
  @ApiOperation({ summary: 'get one character with specified id' })
  @ApiResponse({ status: 200, type: Character })
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return await this.characterService.getOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'update one character with specified id' })
  @ApiResponse({ status: 200, type: Character })
  @Roles(RolesEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateOne(@Param('id', ParseIntPipe) id: number, @Body() updateCharacterDto: UpdateCharacterDto) {
    return this.characterService.updateOne(id, updateCharacterDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'remove one character with specified id' })
  @ApiResponse({ status: 200, type: Character })
  removeOne(@Param('id', ParseIntPipe) id: number) {
    return this.characterService.removeOne(id)
  }
}
