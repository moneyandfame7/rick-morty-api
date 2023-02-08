import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateRoleDto } from './dto/create-role.dto'
import { RolesRepository } from './roles.repository'

@Injectable()
export class RolesService {
  constructor(private readonly roleRepository: RolesRepository) {}

  async createRole(createRoleDto: CreateRoleDto) {
    const role = await this.roleRepository.create(createRoleDto)
    return await this.roleRepository.save(role)
  }

  async getMany() {
    const roles = await this.roleRepository.getMany()
    if (!roles) throw new NotFoundException()

    return roles
  }

  async getRole(value: string) {
    const role = await this.roleRepository.getOne(value)
    if (!role) throw new BadRequestException(`Role ${value} does not exist.`)

    return role
  }
}
