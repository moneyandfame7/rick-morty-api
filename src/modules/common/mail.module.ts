import { Module } from '@nestjs/common'

import { MailService } from '@app/services/common'
import { MailController } from '@app/controllers/common'

import { EnvironmentConfigModule } from '@modules/common'

@Module({
  imports: [EnvironmentConfigModule],
  providers: [MailService],
  controllers: [MailController],
  exports: [MailService]
})
export class MailModule {}
