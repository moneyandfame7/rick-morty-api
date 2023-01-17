import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { EpisodeService } from './episode.service'
import { CreateEpisodeDto } from './dto/create-episode.dto'
import { UpdateEpisodeDto } from './dto/update-episode.dto'

@Controller('episodes')
export class EpisodeController {
  constructor(private readonly episodeService: EpisodeService) {}

  @Post()
  create(@Body() createEpisodeDto: CreateEpisodeDto) {
    return this.episodeService.create(createEpisodeDto)
  }

  @Get()
  findAll(@Query() query) {
    return this.episodeService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.episodeService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEpisodeDto: UpdateEpisodeDto) {
    return this.episodeService.update(+id, updateEpisodeDto)
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.episodeService.remove(+id)
  }
}
