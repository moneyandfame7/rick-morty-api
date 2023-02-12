import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'
import { Request } from 'express'
import * as _ from 'lodash'
import { memoryStorage } from 'multer'
import { CharacterService } from '../../services/main/character.service'
import { CreateCharacterDto, QueryCharacterDto, UpdateCharacterDto } from '../../dto/main/character.dto'
import { QueryPaginationDto } from '../../dto/common/pagination.dto'
import { Character } from '../../entities/main/character.entity'
import { RolesEnum } from '../../common/constants/roles.enum'
import { JwtAuthGuard } from '../../common/guards/auth/jwt.guard'
import { RolesGuard } from '../../common/guards/roles.guard'
import { Roles } from '../../common/decorators/roles.decorator'

@Controller('api/characters')
@ApiTags('characters')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

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
    const queryPaginationDto: QueryPaginationDto = {
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
    return await this.characterService.getMany(queryPaginationDto, queryCharacterDto as QueryCharacterDto)
  }

  @Get(':id')
  @ApiOperation({ summary: 'get one character with specified id' })
  @ApiResponse({ status: 200, type: Character })
  @UseGuards(JwtAuthGuard)
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
  @Roles(RolesEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  removeOne(@Param('id', ParseIntPipe) id: number) {
    return this.characterService.removeOne(id)
  }
}
