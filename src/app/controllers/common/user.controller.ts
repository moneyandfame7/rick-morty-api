import { Body, Controller, ForbiddenException, InternalServerErrorException, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'
import { memoryStorage } from 'multer'
import type { Response } from 'express'

import { EnvironmentConfigService, TokenService, UserService } from '@app/services/common'
import { AddRoleDto, BanUserDto, CreateUserDto, UpdateUserDto } from '@app/dto/common'

import { User } from '@infrastructure/entities/common'

import { USER_OPERATION } from '@common/operations/common'
import { ApiEntitiesOperation, GetUser } from '@common/decorators'
import { JwtPayload } from '@core/models/authorization'
import { AuthorizationService } from '@app/services/authorization'
import { UserException } from '@common/exceptions/common'

@Controller('api/users')
@ApiTags('users')
export class UserController {
  public constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly authorizationService: AuthorizationService,
    private readonly config: EnvironmentConfigService,
    private readonly userException: UserException
  ) {}

  @ApiEntitiesOperation(USER_OPERATION.CREATE)
  public async createOne(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createOne(createUserDto)
  }

  @ApiEntitiesOperation(USER_OPERATION.GET_COUNT)
  public async getCount(): Promise<number> {
    return this.userService.getCount()
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
  public async removeOne(@Param('id') id: string, @GetUser() user: JwtPayload, @Res({ passthrough: true }) res: Response): Promise<User> {
    const exist = await this.userService.getOneById(id)
    const isAdmin = user.role.value === 'admin'

    if (!exist) {
      throw this.userException.withIdNotFound()
    }

    if (user.id === id) {
      const token = await this.tokenService.getOneByUserId(id)
      if (!token) {
        throw new InternalServerErrorException('token aboboaosdoasd')
      }
      res.clearCookie(this.config.getJwtRefreshCookie())
      res.clearCookie(this.config.getJwtAccessCookie())
      await this.authorizationService.logout(token.refresh_token)
      return this.userService.removeOne(id)
    }
    if (isAdmin) {
      return this.userService.removeOne(id)
    }

    throw new ForbiddenException()
  }

  @ApiEntitiesOperation(USER_OPERATION.ADD_ROLE)
  public async addRole(@Body() addRoleDto: AddRoleDto): Promise<User> {
    return this.userService.addRole(addRoleDto)
  }

  @ApiEntitiesOperation(USER_OPERATION.BAN)
  public async ban(@Body() banUserDto: BanUserDto): Promise<User> {
    return this.userService.ban(banUserDto)
  }

  @Post('/photo')
  @ApiEntitiesOperation(USER_OPERATION.CHANGE_IMAGE)
  @UseInterceptors(FileInterceptor('photo', { storage: memoryStorage() }))
  public async changeImage(@GetUser() user: JwtPayload, @UploadedFile() file: Express.Multer.File): Promise<User> {
    return this.userService.changePhoto(user.id, file)
  }
}
