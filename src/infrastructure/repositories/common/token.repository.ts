import { DataSource, Repository, SelectQueryBuilder } from 'typeorm'
import { Injectable } from '@nestjs/common'

import { Token } from '@infrastructure/entities/common'

@Injectable()
export class TokenRepository extends Repository<Token> {
  public constructor(private readonly dataSource: DataSource) {
    super(Token, dataSource.createEntityManager())
  }

  private get builder(): SelectQueryBuilder<Token> {
    return this.createQueryBuilder('token')
  }

  private buildRelations(builder: SelectQueryBuilder<Token>) {
    builder.leftJoinAndSelect('token.user_id', 'user')
  }

  public async get(user_id: string): Promise<Token | null> {
    const queryBuilder = this.builder

    return queryBuilder.where('user_id = :user_id', { user_id }).getOne()
  }

  public async removeByToken(refresh_token: string): Promise<Token> {
    const queryBuilder = this.builder

    const { raw } = await queryBuilder.delete().from(Token).where('refresh_token = :refresh_token', { refresh_token }).returning('*').execute()
    return raw[0]
  }

  public async findByToken(refresh_token: string): Promise<Token | null> {
    const queryBuilder = this.builder
    this.buildRelations(queryBuilder)
    return queryBuilder.where('refresh_token = :refresh_token', { refresh_token }).getOne()
  }

  public async getOneByUserId(user_id: string): Promise<Token | null> {
    const queryBuilder = this.builder

    return queryBuilder.where('user_id = :user_id', { user_id }).getOne()
  }
}
