import { DataSource, Repository, SelectQueryBuilder } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { User } from './entities/user.entity'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager())
  }

  private get builder(): any {
    return this.createQueryBuilder('user')
  }

  public async createOne(createUserDto: CreateUserDto) {
    const queryBuilder: SelectQueryBuilder<User> = this.builder
    const created = await queryBuilder.insert().into(User).values(createUserDto).returning('*').execute()

    return created.raw[0]
  }

  public async getOne(id: User['id']): Promise<User> {
    const queryBuilder: SelectQueryBuilder<User> = this.builder

    return await queryBuilder.where('user.id = :id', { id }).getOne()
  }

  public async getMany() {
    const queryBuilder: SelectQueryBuilder<User> = this.builder

    return await queryBuilder.getMany()
  }

  public async updateOne(id: User['id'], updateUserDto: UpdateUserDto): Promise<User> {
    const queryBuilder: SelectQueryBuilder<User> = this.builder

    const updated = await queryBuilder.update(User).set(updateUserDto).where('id = :id', { id }).returning('*').execute()

    return updated.raw[0]
  }

  public async removeOne(id: User['id']): Promise<User> {
    const queryBuilder: SelectQueryBuilder<User> = this.builder

    const removed = await queryBuilder.delete().from(User).where('id = :id', { id }).returning('*').execute()

    return removed.raw[0]
  }

  public async getCount(): Promise<number> {
    const queryBuilder = this.builder

    return await queryBuilder.getCount()
  }

  public async getOneByEmail(email: string): Promise<User> {
    const queryBuilder = this.builder

    return await queryBuilder.where('email = :email', { email })
  }
}
