import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'
import { Request } from 'express'
import * as _ from 'lodash'
import { memoryStorage } from 'multer'
import { CharacterService } from '@services/main/character.service'
import { CreateCharacterDto, QueryCharacterDto, UpdateCharacterDto } from '@dto/main/character.dto'
import { Character } from '@entities/main/character.entity'
import { RolesEnum } from '@common/constants/roles.enum'
import { JwtAuthGuard } from '@common/guards/auth/jwt.guard'
import { RolesGuard } from '@common/guards/roles.guard'
import { Roles } from '@common/decorators/roles.decorator'
import type { Response } from '@services/common/pagination.service'
import { QueryPaginationDto } from '@dto/common/pagination.dto'

@Controller('api/characters')
@ApiTags('characters')
export class CharacterController {
  public constructor(private readonly characterService: CharacterService) {}

  @Post()
  @ApiOperation({ summary: 'create and save a new character to collection' })
  @ApiResponse({ status: 200, type: Character })
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  @Roles(RolesEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  public async createOne(@Body() character: CreateCharacterDto, @UploadedFile() file: Express.Multer.File): Promise<Character> {
    return this.characterService.createOne(character, file)
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'get all characters by queries' })
  @ApiResponse({ status: 200, type: [Character] })
  public async getMany(@Query(new ValidationPipe({ transform: true })) query: QueryCharacterDto, @Req() req: Request): Promise<Response<Character>> {
    const queryPaginationDto: QueryPaginationDto = {
      take: query.take,
      page: query.page,
      order: query.order,
      skip: query.skip,
      otherQuery: req.originalUrl.split('?')[1],
      endpoint: 'characters'
    }
    const queryCharacterDto = _.omitBy(
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
    return this.characterService.getMany(queryPaginationDto, queryCharacterDto as QueryCharacterDto)
  }

  @Get(':id')
  @ApiOperation({ summary: 'get one character with specified id' })
  @ApiResponse({ status: 200, type: Character })
  @UseGuards(JwtAuthGuard)
  public async getOne(@Param('id', ParseIntPipe) id: number): Promise<Character> {
    return this.characterService.getOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'update one character with specified id' })
  @ApiResponse({ status: 200, type: Character })
  @Roles(RolesEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  public async updateOne(@Param('id', ParseIntPipe) id: number, @Body() updateCharacterDto: UpdateCharacterDto): Promise<Character> {
    return this.characterService.updateOne(id, updateCharacterDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'remove one character with specified id' })
  @ApiResponse({ status: 200, type: Character })
  @Roles(RolesEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  public async removeOne(@Param('id', ParseIntPipe) id: number): Promise<Character> {
    return this.characterService.removeOne(id)
  }
}
