import { DataSource, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { Session } from './entities/session.entity'

@Injectable()
export class SessionRepository extends Repository<Session> {
  constructor(private dataSource: DataSource) {
    super(Session, dataSource.createEntityManager())
  }
}
