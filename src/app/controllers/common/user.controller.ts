import { Body, Controller, ForbiddenException, InternalServerErrorException, Param, Query, Res, UploadedFile, UseInterceptors } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'
import { memoryStorage } from 'multer'
import type { Response } from 'express'

import { EnvironmentConfigService, TokenService, UserService } from '@app/services/common'
import { AuthorizationService } from '@app/services/authorization'

import { AddRoleDto, BanUserDto, CreateUserDto, UpdatePasswordDto, UserQueryDto } from '@infrastructure/dto/common'
import { User } from '@infrastructure/entities/common'

import type { AuthResponse, JwtPayload } from '@core/models/authorization'
import type { GetManyUsers, RecentUsers, UpdateUser, UserStatistics } from '@core/models/common'

import { USER_OPERATION } from '@common/operations/common'
import { ApiEntitiesOperation, GetUser } from '@common/decorators'
import { UserException } from '@common/exceptions/common'
import { hasPermission } from '@common/utils'
import { RolesEnum } from '@common/constants'
import { BaseAuthorizationController } from '@core/controllers/authorization'

@Controller('api/users')
@ApiTags('users')
export class UserController extends BaseAuthorizationController {
  public constructor(
    protected readonly userService: UserService,
    protected readonly tokenService: TokenService,
    protected readonly authService: AuthorizationService,
    protected readonly config: EnvironmentConfigService,
    protected readonly userException: UserException
  ) {
    super(config, authService, userService, tokenService)
  }

  @ApiEntitiesOperation(USER_OPERATION.CREATE)
  public async createOne(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createOne(createUserDto)
  }

  @ApiEntitiesOperation(USER_OPERATION.GET_COUNT)
  public async getCount(): Promise<number> {
    return this.userService.getCount()
  }

  @ApiEntitiesOperation(USER_OPERATION.GET_STATISTICS)
  public async getStatistics(): Promise<UserStatistics> {
    return this.userService.getStatistics()
  }

  @ApiEntitiesOperation(USER_OPERATION.GET_RECENT)
  public async getRecent(): Promise<RecentUsers[]> {
    return this.userService.getRecent()
  }

  @ApiEntitiesOperation(USER_OPERATION.GET_MANY)
  public async getMany(@GetUser() user: JwtPayload, @Query() dto: UserQueryDto): Promise<GetManyUsers> {
    return this.userService.getMany(dto, user.id)
  }

  @ApiEntitiesOperation(USER_OPERATION.EDIT_SETTINGS)
  public async editSettings(@GetUser() user: JwtPayload, @Body() changedFields: UpdateUser, @Res({ passthrough: true }) res: Response): Promise<User> {
    const updated = await this.userService.editSettings(user, changedFields)
    const data = await this.authService.buildUserInfoAndTokens(updated)
    this.setCookies(res, data.refresh_token, data.access_token)
    return updated
  }

  @ApiEntitiesOperation(USER_OPERATION.UPDATE_PASSWORD)
  public async updatePassword(@GetUser() user: JwtPayload, @Body() dto: UpdatePasswordDto, @Res({ passthrough: true }) res: Response): Promise<AuthResponse> {
    const updated = await this.userService.updatePassword(user, dto)
    const data = await this.authService.buildUserInfoAndTokens(updated)

    this.setCookies(res, data.refresh_token, data.access_token)
    return data
  }

  @ApiEntitiesOperation(USER_OPERATION.REMOVE_MANY)
  public async removeMany(@Body('ids') ids: string[]): Promise<void> {
    return this.userService.removeMany(ids)
  }
  @ApiEntitiesOperation(USER_OPERATION.GET_ONE)
  public async getOne(@Param('id') id: string): Promise<User> {
    return this.userService.getOneById(id)
  }

  @ApiEntitiesOperation(USER_OPERATION.UPDATE)
  public async updateOneByAdmin(@Param('id') id: string, @Body() changedFields: UpdateUser): Promise<User> {
    return this.userService.updateOneByAdmin(id, changedFields)
  }

  @ApiEntitiesOperation(USER_OPERATION.REMOVE)
  public async removeOne(@Param('id') id: string, @GetUser() user: JwtPayload, @Res({ passthrough: true }) res: Response): Promise<User> {
    const exist = await this.userService.getOneById(id)
    const isPrivelegedRole = hasPermission(user.role.value)

    if (!exist) {
      throw this.userException.withIdNotFound()
    }

    if (user.id === id) {
      const token = await this.tokenService.getOneByUserId(id)
      if (!token) {
        throw new InternalServerErrorException('token not founded in db')
      }
      res.clearCookie(this.config.getJwtRefreshCookie())
      res.clearCookie(this.config.getJwtAccessCookie())
      await this.authService.logout(token.refresh_token)
      return this.userService.removeOne(id)
    }
    if (isPrivelegedRole && exist.role.value !== RolesEnum.OWNER) {
      return this.userService.removeOne(id)
    }

    throw new ForbiddenException()
  }

  @ApiEntitiesOperation(USER_OPERATION.ADD_ROLE)
  public async addRole(@Body() addRoleDto: AddRoleDto): Promise<User> {
    return this.userService.addRole(addRoleDto)
  }

  @ApiEntitiesOperation(USER_OPERATION.BAN)
  public async ban(@Body() banUserDto: BanUserDto, @GetUser() initiator: JwtPayload): Promise<User> {
    return this.userService.ban(banUserDto, initiator)
  }

  @ApiEntitiesOperation(USER_OPERATION.CHANGE_IMAGE)
  @UseInterceptors(FileInterceptor('photo', { storage: memoryStorage() }))
  public async changeImage(@GetUser() user: JwtPayload, @UploadedFile() file: Express.Multer.File): Promise<User> {
    return this.userService.changePhoto(user.id, file)
  }
}
