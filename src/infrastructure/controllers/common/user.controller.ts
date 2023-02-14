import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { UserService } from '../../services/common/user.service'
import { Roles } from '../../common/decorators/roles.decorator'
import { RolesGuard } from '../../common/guards/roles.guard'
import { AddRoleDto, BanUserDto, CreateUserDto, UpdateUserDto } from '../../dto/common/user.dto'
import { RolesEnum } from '../../common/constants/roles.enum'
import { JwtAuthGuard } from '../../common/guards/auth/jwt.guard'
import { FileInterceptor } from '@nestjs/platform-express'
import { memoryStorage } from 'multer'
import { Request } from 'express'
import { User } from '../../entities/common/user.entity'

@Controller('api/users')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createOne(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createOne(createUserDto)
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getMany() {
    return await this.userService.getMany()
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getOne(@Param('id') id: string) {
    return await this.userService.getOneById(id)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateOne(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.updateOne(id, updateUserDto)
  }

  @Delete(':id')
  @Roles(RolesEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async removeOne(@Param('id') id: string) {
    return await this.userService.removeOne(id)
  }

  @ApiOperation({ summary: 'Give a role' })
  @ApiResponse({ status: 200 })
  @Roles(RolesEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/role')
  async addRole(@Body() addRoleDto: AddRoleDto) {
    return await this.userService.addRole(addRoleDto)
  }

  @ApiOperation({ summary: 'Ban a user' })
  @ApiResponse({ status: 200 })
  @Roles(RolesEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/ban')
  async ban(@Body() banUserDto: BanUserDto) {
    return await this.userService.ban(banUserDto)
  }

  @Post(':id/photo')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('photo', { storage: memoryStorage() }))
  async changeImage(@Req() req: Request, @UploadedFile() file: Express.Multer.File) {
    const id = (req.user as User).id
    return await this.userService.changePhoto(id, file)
  }
}
