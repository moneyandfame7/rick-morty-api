import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'
import { memoryStorage } from 'multer'
import type { Request } from 'express'

import { UserService } from '@app/services/common'
import { AddRoleDto, BanUserDto, CreateUserDto, UpdateUserDto } from '@app/dto/common'

import { User } from '@infrastructure/entities/common'

import { Roles } from '@common/decorators'
import { RolesGuard } from '@common/guards/common'
import { RolesEnum } from '@common/constants'
import { JwtAuthGuard } from '@common/guards/authorization'

@Controller('api/users')
@ApiTags('users')
export class UserController {
  public constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  public async createOne(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createOne(createUserDto)
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  public async getMany(): Promise<User[]> {
    return this.userService.getMany()
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  public async getOne(@Param('id') id: string): Promise<User> {
    return this.userService.getOneById(id)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  public async updateOne(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.userService.updateOne(id, updateUserDto)
  }

  @Delete(':id')
  @Roles(RolesEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  public async removeOne(@Param('id') id: string): Promise<User> {
    return this.userService.removeOne(id)
  }

  @ApiOperation({ summary: 'Give a role' })
  @ApiResponse({ status: 200 })
  @Roles(RolesEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/role')
  public async addRole(@Body() addRoleDto: AddRoleDto): Promise<User> {
    return this.userService.addRole(addRoleDto)
  }

  @ApiOperation({ summary: 'Ban a user' })
  @ApiResponse({ status: 200 })
  @Roles(RolesEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/ban')
  public async ban(@Body() banUserDto: BanUserDto): Promise<User> {
    return this.userService.ban(banUserDto)
  }

  @Post(':id/photo')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('photo', { storage: memoryStorage() }))
  public async changeImage(@Req() req: Request, @UploadedFile() file: Express.Multer.File): Promise<User> {
    const id = (req.user as User).id
    return this.userService.changePhoto(id, file)
  }
}
