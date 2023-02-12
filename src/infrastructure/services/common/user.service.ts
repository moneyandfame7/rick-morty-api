import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { AddRoleDto, BanUserDto, CreateUserDto, UpdateUserDto } from '../../dto/common/user.dto'
import { UserRepository } from '../../repositories/common/user.repository'
import { RolesService } from './roles.service'
import { TokenService } from './token.service'

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository, private readonly rolesService: RolesService, private readonly tokenService: TokenService) {}

  async createOne(dto: CreateUserDto) {
    const userWithSameEmail = await this.getOneByEmail(dto.email)

    if (userWithSameEmail && userWithSameEmail.authType === 'jwt') throw new BadRequestException(`User ${dto.email} already exists.`)

    const user = await this.userRepository.createOne(dto)
    user.role = await this.rolesService.getRole('user')
    return await this.userRepository.save(user)
  }

  async getOneById(id: string) {
    const user = await this.userRepository.getOneById(id)

    if (!user) throw new BadRequestException(`User with id ${id} does not exist.`)

    return user
  }

  async getOneByEmail(email: string) {
    const user = await this.userRepository.getOneByEmail(email)

    return user ? user : null
  }

  async getOneByAuthType(email: string, authType: string) {
    const user = await this.userRepository.getOneByAuthType(email, authType)

    return user ? user : null
  }

  async getOneByUsername(username: string) {
    const user = await this.userRepository.getOneByUsername(username)

    return user ? user : null
  }

  async getMany() {
    const users = await this.userRepository.getMany()

    if (!users.length) throw new NotFoundException('Users not found.')

    return users
  }

  async getCount() {
    return await this.userRepository.getCount()
  }

  async updateOne(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.getOneById(id)

    if (!user) throw new BadRequestException(`User with id ${id} does not exist.`)

    return await this.userRepository.updateOne(id, updateUserDto)
  }

  async removeOne(id: string) {
    try {
      const user = await this.userRepository.getOneById(id)
      await this.tokenService.removeByUserId(user.id)
      if (!user) throw new BadRequestException(`User with id ${id} does not exist.`)

      return await this.userRepository.removeOne(id)
    } catch (e) {
      throw new BadRequestException('Invalid id')
    }
  }

  async addRole(dto: AddRoleDto) {
    const user = await this.userRepository.getOneById(dto.userId)
    const role = await this.rolesService.getRole(dto.value)

    if (user && role) {
      user.role = role
      return await this.userRepository.save(user)
    }
    throw new BadRequestException('Role or user not found.')
  }

  async ban(dto: BanUserDto) {
    const user = await this.userRepository.getOneById(dto.userId)
    if (!user) throw new BadRequestException(`User with id ${dto.userId} does not exist.`)

    return await this.userRepository.ban(dto.userId, dto.banReason)
  }

  public async emailExists(email: string) {
    const user = await this.userRepository.getOneByEmail(email)

    return !!user
  }
}
