import { Injectable } from '@nestjs/common'
import { SessionRepository } from './session.repository'

@Injectable()
export class SessionService {
  constructor(private readonly sessionRepository: SessionRepository) {}
  async getOneByData(data: any) {
    return await this.sessionRepository.findOneBy({ json: data })
  }

  async removeOneByData(json: string) {
    // return data
    return await this.sessionRepository.delete({ json })
  }
}
