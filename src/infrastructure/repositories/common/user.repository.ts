import { DataSource, Repository, type SelectQueryBuilder } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { User } from '@entities/common/user.entity'
import type { CreateUserDto, UpdateUserDto } from '@dto/common/user.dto'

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager())
  }

  private get builder(): SelectQueryBuilder<User> {
    return this.createQueryBuilder('user')
  }

  private buildRelations(builder: SelectQueryBuilder<User>): void {
    builder.leftJoinAndSelect('user.role', 'role')
  }

  public async createOne(createUserDto: CreateUserDto): Promise<User> {
    const queryBuilder = this.builder
    // todo: fix any
    const created = await queryBuilder
      .insert()
      .into(User)
      .values(createUserDto as any)
      .returning('*')
      .execute()

    return created.raw[0]
  }

  public async getOneById(id: User['id']): Promise<User | null> {
    const queryBuilder = this.builder
    this.buildRelations(queryBuilder)

    return queryBuilder.where('user.id = :id', { id }).getOne()
  }

  public async getMany(): Promise<User[]> {
    const queryBuilder = this.builder
    this.buildRelations(queryBuilder)

    return queryBuilder.getMany()
  }

  public async updateOne(id: User['id'], updateUserDto: UpdateUserDto): Promise<User> {
    const queryBuilder = this.builder

    // todo: fix any
    const updated = await queryBuilder
      .update(User)
      .set(updateUserDto as any)
      .where('id = :id', { id })
      .returning('*')
      .execute()

    return updated.raw[0]
  }

  public async removeOne(id: User['id']): Promise<User> {
    const queryBuilder = this.builder
    this.buildRelations(queryBuilder)

    const removed = await queryBuilder.delete().from(User).where('id = :id', { id }).returning('*').execute()

    return removed.raw[0]
  }

  public async getOneByUsername(username: string): Promise<User | null> {
    const queryBuilder = this.builder
    this.buildRelations(queryBuilder)

    return queryBuilder.where('username = :username', { username }).getOne()
  }

  public async getOneByVerifyLink(verify_link: string): Promise<User | null> {
    const queryBuilder = this.builder
    this.buildRelations(queryBuilder)

    return queryBuilder.where('verify_link = :verify_link', { verify_link }).getOne()
  }

  public async getOneByEmail(email: string): Promise<User | null> {
    const queryBuilder = this.builder
    this.buildRelations(queryBuilder)

    return queryBuilder.where('email = :email', { email }).getOne()
  }

  public async getOneByAuthType(email: string, auth_type: string): Promise<User | null> {
    const queryBuilder = this.builder
    this.buildRelations(queryBuilder)
    return queryBuilder.where('email = :email', { email }).andWhere('auth_type = :auth_type', { auth_type }).getOne()
  }

  public async ban(id: string, ban_reason: string): Promise<User> {
    const queryBuilder = this.builder
    this.buildRelations(queryBuilder)

    const banned = await queryBuilder
      .update(User)
      .set({
        banned: true,
        ban_reason
      })
      .where('id = :id', { id })
      .returning('*')
      .execute()

    return banned.raw[0]
  }

  public async getCount(): Promise<number> {
    const queryBuilder = this.builder

    return queryBuilder.getCount()
  }
}
