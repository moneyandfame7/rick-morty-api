import { Module } from '@nestjs/common'
import { SessionService } from './session.service'
import { SessionRepository } from './session.repository'

@Module({
  controllers: [],
  providers: [SessionService, SessionRepository],
  exports: [SessionService]
})
export class SessionModule {}
