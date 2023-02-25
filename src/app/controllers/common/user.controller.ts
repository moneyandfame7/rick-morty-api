import { Body, Controller, Param, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'
import { memoryStorage } from 'multer'
import type { Request } from 'express'

import { UserService } from '@app/services/common'
import { AddRoleDto, BanUserDto, CreateUserDto, UpdateUserDto } from '@app/dto/common'

import { User } from '@infrastructure/entities/common'

import { JwtAuthGuard } from '@common/guards/authorization'
import { USER_OPERATION } from '@common/swagger/common'
import { ApiEntitiesOperation } from '@common/decorators'

@Controller('api/users')
@ApiTags('users')
export class UserController {
  public constructor(private readonly userService: UserService) {}

  @ApiEntitiesOperation(USER_OPERATION.CREATE)
  public async createOne(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createOne(createUserDto)
  }

  @ApiEntitiesOperation(USER_OPERATION.GET_MANY)
  public async getMany(): Promise<User[]> {
    return this.userService.getMany()
  }

  @ApiEntitiesOperation(USER_OPERATION.GET_ONE)
  public async getOne(@Param('id') id: string): Promise<User> {
    return this.userService.getOneById(id)
  }

  @ApiEntitiesOperation(USER_OPERATION.UPDATE)
  public async updateOne(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.userService.updateOne(id, updateUserDto)
  }

  @ApiEntitiesOperation(USER_OPERATION.REMOVE)
  public async removeOne(@Param('id') id: string): Promise<User> {
    return this.userService.removeOne(id)
  }

  @ApiEntitiesOperation(USER_OPERATION.ADD_ROLE)
  public async addRole(@Body() addRoleDto: AddRoleDto): Promise<User> {
    return this.userService.addRole(addRoleDto)
  }

  @ApiEntitiesOperation(USER_OPERATION.BAN)
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
