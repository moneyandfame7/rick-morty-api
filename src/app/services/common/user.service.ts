import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

import { RolesService, S3Service, TokenService } from '@app/services/common'
import { AddRoleDto, BanUserDto, CreateUserDto, UpdatePasswordDto, UserQueryDto } from '@infrastructure/dto/common'

import { UserRepository } from '@infrastructure/repositories/common'
import { User } from '@infrastructure/entities/common'

import { UserException } from '@common/exceptions/common'
import { AUTHORIZATION_PROVIDER, RolesEnum } from '@common/constants'
import { hasPermission } from '@common/utils'

import type { AuthResponse, JwtPayload } from '@core/models/authorization'
import type { GetManyUsers, RecentUsers, UpdateUser, UserStatistics } from '@core/models/common'

@Injectable()
export class UserService {
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly rolesService: RolesService,
    private readonly tokenService: TokenService,
    private readonly s3Service: S3Service,
    private readonly userException: UserException
  ) {}

  public async createOne(dto: CreateUserDto): Promise<User> {
    const userWithSameEmail = await this.getOneByAuthType(dto.email, dto.auth_type)
    if (userWithSameEmail && userWithSameEmail.auth_type === AUTHORIZATION_PROVIDER.JWT) {
      throw this.userException.alreadyExistsWithEmail(dto.email)
    }

    const user = await this.userRepository.createOne(dto)
    user.role = await this.rolesService.getOne('user')
    if (user.auth_type !== AUTHORIZATION_PROVIDER.JWT) {
      user.username = 'Guest' + user.id
    }
    return this.userRepository.save(user)
  }

  public async getMany(query: UserQueryDto, initiatorId: string): Promise<GetManyUsers> {
    return this.userRepository.getMany(query, initiatorId)
  }

  public async getStatistics(): Promise<UserStatistics> {
    return this.userRepository.getStatistics()
  }

  public async getRecent(): Promise<RecentUsers[]> {
    return this.userRepository.getRecent()
  }

  public async getOneById(id: string): Promise<User> {
    const user = await this.userRepository.getOneById(id)

    if (!user) {
      throw this.userException.withIdNotFound()
    }

    return user
  }

  public async getOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.getOneByEmail(email)
  }

  public async getOneByAuthType(email: string, authType: string): Promise<User | null> {
    return this.userRepository.getOneByAuthType(email, authType)
  }

  public async getOneByUsername(username: string): Promise<User | null> {
    return this.userRepository.getOneByUsername(username)
  }

  public async getOneByVerifyLink(link: string): Promise<User> {
    const user = await this.userRepository.getOneByVerifyLink(link)
    if (!user) {
      throw this.userException.notFound()
    }

    return user
  }

  public async updateOne(id: string, changedFields: UpdateUser): Promise<User> {
    const user = await this.userRepository.getOneById(id)

    if (!user) {
      throw this.userException.withIdNotFound()
    }

    const role = changedFields.role ? await this.rolesService.getOne(changedFields.role.value) : user.role

    return this.userRepository.save({ ...user, ...changedFields, role })
  }

  public async editSettings(user: JwtPayload, changedFields: UpdateUser): Promise<User> {
    return this.updateOne(user.id, changedFields)
  }

  public async updateOneByAdmin(id: string, changedFields: UpdateUser): Promise<User> {
    if (changedFields.username) {
      const exist = await this.userRepository.findOneBy({
        username: changedFields.username
      })
      if (exist) {
        throw this.userException.alreadyExistsWithUsername(changedFields.username)
      }
    }

    const user = await this.updateOne(id, changedFields)

    this.tokenService.removeByUserId(user.id)
    return user
  }

  public async changeUsername(id: string, username: string): Promise<User> {
    const user = await this.userRepository.getOneByUsername(username)
    if (user) {
      throw this.userException.alreadyExistsWithUsername(username)
    }

    return this.updateOne(id, { username })
  }

  public async updatePassword(initiator: JwtPayload, dto: UpdatePasswordDto): Promise<User> {
    const { oldPassword, newPassword, confirmPassword } = dto

    const user = await this.getOneById(initiator.id)
    if (!user) {
      throw new BadRequestException()
    }

    const oldPasswordIsCorrect = await this.comparePassword(oldPassword, user.password)
    const confirmIsEqual = newPassword === confirmPassword
    const newPasswordIsEqualToOld = newPassword === oldPassword
    if (!oldPasswordIsCorrect) {
      throw this.userException.incorrectPassword()
    }

    if (!confirmIsEqual) {
      throw this.userException.passwordsDontMatch()
    }

    if (newPasswordIsEqualToOld) {
      throw this.userException.passwordIsEqualToOld()
    }

    const hashedPassword = await this.hashPassword(newPassword)

    return this.updateOne(user.id, { password: hashedPassword })
  }

  public async save(user: User): Promise<User> {
    return this.userRepository.save(user)
  }

  public async changePhoto(id: string, file: Express.Multer.File): Promise<User> {
    if (!file) {
      throw new BadRequestException('You must provide a photo')
    }
    const userFileName = `users/${id}/${new Date().getMilliseconds()}`

    const user = await this.getOneById(id)
    user.photo = await this.s3Service.upload(file, userFileName)

    return this.userRepository.save(user)
  }

  public async removeOne(id: string): Promise<User> {
    const user = await this.userRepository.getOneById(id)

    if (!user) {
      throw this.userException.withIdNotFound()
    }

    await this.tokenService.removeByUserId(user.id)
    return this.userRepository.removeOne(id)
  }

  public async removeMany(ids: string[]): Promise<void> {
    return this.userRepository.removeMany(ids)
  }

  public async addRole(dto: AddRoleDto): Promise<User> {
    const user = await this.userRepository.getOneById(dto.userId)
    const role = await this.rolesService.getOne(dto.value)

    if (user && role) {
      user.role = role
      return this.userRepository.save(user)
    }
    throw new BadRequestException('Role or user not found.')
  }

  public async ban(dto: BanUserDto, initiator: JwtPayload): Promise<User> {
    const user = await this.userRepository.getOneById(dto.userId)
    const isPrivelegedRole = hasPermission(initiator.role.value)
    if (!user) {
      throw this.userException.withIdNotFound()
    }
    if (user.id === initiator.id) {
      return this.userRepository.ban(dto.userId, dto.banReason)
    } else if (isPrivelegedRole && user.role.value !== RolesEnum.OWNER) {
      return this.userRepository.ban(dto.userId)
    }
    throw new ForbiddenException()
  }

  public async emailExists(email: string): Promise<boolean> {
    const user = await this.userRepository.getOneByEmail(email)

    return !!user
  }

  public async getCount(): Promise<number> {
    return this.userRepository.getCount()
  }

  public async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 3)
  }

  public async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }
}
