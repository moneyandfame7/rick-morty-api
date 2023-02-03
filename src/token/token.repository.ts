import { DataSource, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { Token } from './entities/token.entity'

@Injectable()
export class TokenRepository extends Repository<Token> {
  constructor(private dataSource: DataSource) {
    super(Token, dataSource.createEntityManager())
  }

  private get builder(): any {
    return this.createQueryBuilder('token')
  }
  //
  // private buildRelations(builder: SelectQueryBuilder<Token>) {
  //   builder.leftJoinAndSelect('token.userId', 'user')
  // }

  public async get(user_id: string): Promise<Token> {
    const queryBuilder = this.builder
    // this.buildRelations(queryBuilder)

    return await queryBuilder.where('user_id = :user_id', { user_id }).getOne()
  }
}
