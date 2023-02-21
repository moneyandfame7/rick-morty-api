import { Injectable } from '@nestjs/common'
import type { CreateRoleDto } from '@dto/common/roles.dto'
import { RolesRepository } from '@repositories/common/roles.repository'
import { RoleAlreadyExistException, RoleDoesNotExistException, RolesNotFoundExcetion } from '@domain/exceptions/common/role.exception'
import type { Role } from '@entities/common/role.entity'

@Injectable()
export class RolesService {
  constructor(private readonly roleRepository: RolesRepository) {}

  async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    const withSameValue = await this.roleRepository.getOne(createRoleDto.value)
    if (withSameValue) throw new RoleAlreadyExistException(createRoleDto.value)

    const role = this.roleRepository.create(createRoleDto)
    return this.roleRepository.save(role)
  }

  async getMany(): Promise<Role[]> {
    const roles = await this.roleRepository.getMany()
    if (!roles) throw new RolesNotFoundExcetion()

    return roles
  }

  async getOne(value: string): Promise<Role> {
    const role = await this.roleRepository.getOne(value)
    if (!role) throw new RoleDoesNotExistException(value)

    return role
  }
}
