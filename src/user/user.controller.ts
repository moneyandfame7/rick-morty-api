import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { ApiTags } from '@nestjs/swagger'

@Controller('api/users')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createOne(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createOne(createUserDto)
  }

  @Get()
  async getMany() {
    return await this.userService.getMany()
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return await this.userService.getOne(id)
  }

  @Patch(':id')
  async updateOne(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.updateOne(id, updateUserDto)
  }

  @Delete(':id')
  async removeOne(@Param('id') id: string) {
    return await this.userService.removeOne(id)
  }

  @Delete()
  async removeAll() {
    return await this.userService.removeAll()
  }
}
