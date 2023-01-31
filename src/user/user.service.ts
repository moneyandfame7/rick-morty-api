import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserRepository } from './user.repository'
import { RolesService } from '../roles/roles.service'

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository, private readonly rolesService: RolesService) {}

  async createOne(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.getOneByEmail(createUserDto.email)
    if (existingUser) throw new BadRequestException(`User ${createUserDto.email} already exists.`)

    const user = await this.userRepository.createOne(createUserDto)
    user.roles = await this.rolesService.getRole('user')
    return await this.userRepository.save(user)
  }

  async getOne(id: string) {
    const user = await this.userRepository.getOne(id)

    if (!user) throw new BadRequestException(`User with id ${id}  does not exist.`)

    return user
  }

  async getMany() {
    const users = await this.userRepository.getMany()

    if (!users.length) throw new NotFoundException('Users not found.')

    return users
  }

  async updateOne(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.getOne(id)

    if (!user) throw new BadRequestException(`User with id ${id} does not exist.`)

    return await this.userRepository.updateOne(id, updateUserDto)
  }

  async removeOne(id: string) {
    const user = await this.userRepository.getOne(id)

    if (!user) throw new BadRequestException(`User with id ${id} does not exist.`)

    return await this.userRepository.removeOne(id)
  }

  async geCount() {
    return await this.userRepository.getCount()
  }
}
