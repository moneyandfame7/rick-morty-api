import { Injectable } from '@nestjs/common'

import { CreateRoleDto } from '@app/dto/common'

import { RolesException } from '@common/exceptions/common'

import { Role } from '@infrastructure/entities/common'
import { RolesRepository } from '@infrastructure/repositories/common'

@Injectable()
export class RolesService {
  public constructor(private readonly roleRepository: RolesRepository, private readonly rolesException: RolesException) {}

  public async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    const exists = await this.roleRepository.getOne(createRoleDto.value)
    if (exists) {
      throw this.rolesException.alreadyExists(exists.value)
    }

    const role = this.roleRepository.create(createRoleDto)
    return this.roleRepository.save(role)
  }

  public async getMany(): Promise<Role[]> {
    const roles = await this.roleRepository.getMany()
    if (!roles) {
      throw this.rolesException.manyNotFound()
    }

    return roles
  }

  public async getOne(value: string): Promise<Role> {
    const role = await this.roleRepository.getOne(value)
    if (!role) {
      throw this.rolesException.withValueNotFound(value)
    }

    return role
  }
}
