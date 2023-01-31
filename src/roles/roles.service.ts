import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateRoleDto } from './dto/create-role.dto'
import { Role } from './entities/role.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class RolesService {
  constructor(@InjectRepository(Role) private readonly roleRepository: Repository<Role>) {}

  async createRole(createRoleDto: CreateRoleDto) {
    const role = await this.roleRepository.create(createRoleDto)
    return await this.roleRepository.save(role)
  }

  async getRole(value: string) {
    const role = await this.roleRepository.findBy({ value })
    if (!role) throw new BadRequestException(`Role ${value} does not exist.`)

    return role
  }
}
