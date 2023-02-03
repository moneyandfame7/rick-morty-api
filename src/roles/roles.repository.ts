import { DataSource, Repository, SelectQueryBuilder } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { Role } from './entities/role.entity'
import { CreateRoleDto } from './dto/create-role.dto'

@Injectable()
export class RolesRepository extends Repository<Role> {
  constructor(private dataSource: DataSource) {
    super(Role, dataSource.createEntityManager())
  }

  private get builder(): any {
    return this.createQueryBuilder('role')
  }

  private buildRelations(builder: SelectQueryBuilder<Role>) {
    builder.leftJoinAndSelect('role.users', 'users')
  }

  public async createOne(createRoleDto: CreateRoleDto): Promise<Role> {
    const queryBuilder: SelectQueryBuilder<Role> = this.builder
    const created = await queryBuilder.insert().into(Role).values(createRoleDto).returning('*').execute()

    return created.raw[0]
  }

  public async getOne(value: string): Promise<Role> {
    const queryBuilder: SelectQueryBuilder<Role> = this.builder
    this.buildRelations(queryBuilder)

    return await queryBuilder.where('role.value = :value', { value }).getOne()
  }

  public async getMany() {
    const queryBuilder: SelectQueryBuilder<Role> = this.builder
    this.buildRelations(queryBuilder)

    return await queryBuilder.getMany()
  }

  public async getCount(): Promise<number> {
    const queryBuilder = this.builder

    return await queryBuilder.getCount()
  }
}
