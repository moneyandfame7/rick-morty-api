import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserRepository } from './user.repository'
import { RolesService } from '../roles/roles.service'
import { AddRoleDto } from './dto/add-role.dto'
import { BanUserDto } from './dto/ban-user-dto'

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository, private readonly rolesService: RolesService) {}

  async createOne(createUserDto: CreateUserDto) {
    const emailExists = await this.emailExists(createUserDto.email)

    if (emailExists) throw new BadRequestException(`User ${createUserDto.email} already exists.`)

    const user = await this.userRepository.createOne(createUserDto)
    user.role = await this.rolesService.getRole('user')
    return await this.userRepository.save(user)
  }

  async getOneById(id: string) {
    const user = await this.userRepository.getOneById(id)

    if (!user) throw new BadRequestException(`User with id ${id}  does not exist.`)

    return user
  }

  async getMany() {
    const users = await this.userRepository.getMany()

    if (!users.length) throw new NotFoundException('Users not found.')

    return users
  }

  async updateOne(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.getOneById(id)

    if (!user) throw new BadRequestException(`User with id ${id} does not exist.`)

    return await this.userRepository.updateOne(id, updateUserDto)
  }

  async removeOne(id: string) {
    try {
      const user = await this.userRepository.getOneById(id)

      if (!user) throw new BadRequestException(`User with id ${id} does not exist.`)

      return await this.userRepository.removeOne(id)
    } catch (e) {
      throw new BadRequestException('Invalid id')
    }
  }

  async getCount() {
    return await this.userRepository.getCount()
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

  async getOneByEmail(email: string) {
    const user = await this.userRepository.getOneByEmail(email)

    return user ? user : null
  }

  private async emailExists(email: string) {
    const user = await this.userRepository.getOneByEmail(email)

    return !!user
  }
}
