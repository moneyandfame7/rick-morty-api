import { Module } from '@nestjs/common'
import { MailService } from '@services/common/mail.service'
import { MailController } from '@controllers/common/mail.controller'
import { EnvironmentConfigModule } from '@config/environment-config.module'
import { UserModule } from './user.module'

@Module({
  imports: [EnvironmentConfigModule, UserModule],
  providers: [MailService],
  controllers: [MailController],
  exports: [MailService]
})
export class MailModule {}
