import { Injectable } from '@nestjs/common'
import { CreateRoleDto } from '../../dto/common/roles.dto'
import { RolesRepository } from '../../repositories/common/roles.repository'
import { RoleAlreadyExistException, RoleDoesNotExistException, RolesNotFoundExcetion } from '../../../domain/exceptions/common/role.exception'

@Injectable()
export class RolesService {
  constructor(private readonly roleRepository: RolesRepository) {}

  async createRole(createRoleDto: CreateRoleDto) {
    const withSameValue = await this.roleRepository.getOne(createRoleDto.value)
    if (withSameValue) throw new RoleAlreadyExistException(createRoleDto.value)

    const role = await this.roleRepository.create(createRoleDto)
    return await this.roleRepository.save(role)
  }

  async getMany() {
    const roles = await this.roleRepository.getMany()
    if (!roles) throw new RolesNotFoundExcetion()

    return roles
  }

  async getRole(value: string) {
    const role = await this.roleRepository.getOne(value)
    if (!role) throw new RoleDoesNotExistException(value)

    return role
  }
}
