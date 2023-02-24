import { Injectable } from '@nestjs/common'
import type { CreateRoleDto } from '@dto/common/roles.dto'
import { RolesRepository } from '@repositories/common/roles.repository'
import { RoleAlreadyExistException, RoleDoesNotExistException, RolesNotFoundException } from '@domain/exceptions/common/role.exception'
import type { Role } from '@entities/common/role.entity'

@Injectable()
export class RolesService {
  public constructor(private readonly roleRepository: RolesRepository) {}

  public async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    const withSameValue = await this.roleRepository.getOne(createRoleDto.value)
    if (withSameValue) throw new RoleAlreadyExistException(createRoleDto.value)

    const role = this.roleRepository.create(createRoleDto)
    return this.roleRepository.save(role)
  }

  public async getMany(): Promise<Role[]> {
    const roles = await this.roleRepository.getMany()
    if (!roles) throw new RolesNotFoundException()

    return roles
  }

  public async getOne(value: string): Promise<Role> {
    const role = await this.roleRepository.getOne(value)
    if (!role) throw new RoleDoesNotExistException(value)

    return role
  }
}
