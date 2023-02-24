import { DataSource, Repository, SelectQueryBuilder } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { Role } from '@infrastructure/entities/common/role.entity'
import { CreateRoleDto } from '@app/dto/common/roles.dto'

@Injectable()
export class RolesRepository extends Repository<Role> {
  public constructor(private readonly dataSource: DataSource) {
    super(Role, dataSource.createEntityManager())
  }

  private get builder(): SelectQueryBuilder<Role> {
    return this.createQueryBuilder('role')
  }

  private buildRelations(builder: SelectQueryBuilder<Role>): void {
    builder.leftJoinAndSelect('role.users', 'users')
  }

  public async createOne(createRoleDto: CreateRoleDto): Promise<Role> {
    const queryBuilder = this.builder
    const created = await queryBuilder.insert().into(Role).values(createRoleDto).returning('*').execute()

    return created.raw[0]
  }

  public async getOne(value: string): Promise<Role | null> {
    const queryBuilder = this.builder

    return queryBuilder.where('role.value = :value', { value }).getOne()
  }

  public async getMany(): Promise<Role[]> {
    const queryBuilder = this.builder
    this.buildRelations(queryBuilder)

    return queryBuilder.getMany()
  }

  public async getCount(): Promise<number> {
    const queryBuilder = this.builder

    return queryBuilder.getCount()
  }
}
