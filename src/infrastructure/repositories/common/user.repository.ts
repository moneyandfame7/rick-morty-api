import { DataSource, Repository, SelectQueryBuilder } from 'typeorm'
import { Injectable } from '@nestjs/common'

import { CreateUserDto, UserQueryDto } from '@infrastructure/dto/common'
import { User } from '@infrastructure/entities/common'

import type { GetManyUsers, RecentUsers, UpdateUser, UserStatistics } from '@core/models/common'

@Injectable()
export class UserRepository extends Repository<User> {
  public constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager())
  }

  private get builder(): SelectQueryBuilder<User> {
    return this.createQueryBuilder('user')
  }

  private get builderWithRelations(): SelectQueryBuilder<User> {
    return this.createQueryBuilder('user').leftJoinAndSelect('user.role', 'role')
  }

  public async createOne(createUserDto: CreateUserDto): Promise<User> {
    const queryBuilder = this.builder
    const created = await queryBuilder.insert().into(User).values(createUserDto).returning('*').execute()

    return created.raw[0]
  }

  public async getOneById(id: User['id']): Promise<User | null> {
    const queryBuilder = this.builderWithRelations

    return queryBuilder.where('user.id = :id', { id }).getOne()
  }

  public async getMany(query: UserQueryDto, id: string): Promise<GetManyUsers> {
    const queryBuilder = this.builderWithRelations

    const [users, count] = await queryBuilder
      .where('user.id <> :id', { id })
      .skip(query.page * query.pageSize)
      .take(query.pageSize)
      .addOrderBy('user.created_at', 'ASC')
      .getManyAndCount()

    return { users, count }
  }

  public async getRecent(): Promise<RecentUsers[]> {
    const queryBuilder = this.builderWithRelations
    const data = await queryBuilder.take(15).select(['role', 'user.username', 'user.created_at', 'user.photo', 'user.id', 'user.country', 'user.is_verified']).getMany()
    return data.map(user => ({
      username: user.username,
      country: user.country,
      id: user.id,
      created_at: user.created_at,
      is_verified: user.is_verified,
      role: user.role.value,
      photo: user.photo
    }))
  }

  public async getStatistics(): Promise<UserStatistics> {
    const queryBuilder = this.builderWithRelations

    const authStats = await queryBuilder.select('auth_type, COUNT(user.id)', 'count').groupBy('auth_type').getRawMany()
    const userCount = await queryBuilder.getCount()
    const verifiedStats = await queryBuilder.select('COUNT(*)', 'count').addSelect('is_verified', 'verified').groupBy('is_verified').orderBy('is_verified', 'ASC').getRawMany()

    return {
      authStats,
      userCount,
      verifiedStats
    }
  }

  public async updateOne(id: User['id'], updateUserDto: UpdateUser): Promise<User> {
    const queryBuilder = this.builderWithRelations

    const updated = await queryBuilder.update(User).set(updateUserDto).where('id = :id', { id }).execute()
    return updated.raw[0]
  }

  public async removeOne(id: User['id']): Promise<User> {
    const queryBuilder = this.builderWithRelations

    const removed = await queryBuilder.delete().from(User).where('id = :id', { id }).returning('*').execute()

    return removed.raw[0]
  }

  public async removeMany(ids: string[]): Promise<void> {
    const queryBuilder = this.builderWithRelations
    await queryBuilder.delete().from(User).where('id IN (:...ids)', { ids }).execute()
  }

  public async getOneByUsername(username: string): Promise<User | null> {
    const queryBuilder = this.builderWithRelations

    return queryBuilder.where('username = :username', { username }).getOne()
  }

  public async getOneByVerifyLink(verify_link: string): Promise<User | null> {
    const queryBuilder = this.builderWithRelations

    return queryBuilder.where('verify_link = :verify_link', { verify_link }).getOne()
  }

  public async getOneByEmail(email: string): Promise<User | null> {
    const queryBuilder = this.builderWithRelations

    return queryBuilder.where('email = :email', { email }).getOne()
  }

  public async getOneByAuthType(email: string, auth_type: string): Promise<User | null> {
    const queryBuilder = this.builderWithRelations

    return queryBuilder.where('email = :email', { email }).andWhere('auth_type = :auth_type', { auth_type }).getOne()
  }

  public async ban(id: string, ban_reason?: string): Promise<User> {
    const queryBuilder = this.builderWithRelations

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
