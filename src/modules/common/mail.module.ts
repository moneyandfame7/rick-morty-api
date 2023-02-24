import { Module } from '@nestjs/common'

import { MailService } from '@app/services/common/mail.service'
import { MailController } from '@app/controllers/common/mail.controller'

import { EnvironmentConfigModule } from '@modules/common/environment-config.module'

import { UserModule } from './user.module'

@Module({
  imports: [EnvironmentConfigModule, UserModule],
  providers: [MailService],
  controllers: [MailController],
  exports: [MailService]
})
export class MailModule {}
