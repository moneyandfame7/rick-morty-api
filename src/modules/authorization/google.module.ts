import { Module } from '@nestjs/common'

import { GoogleController } from '@app/controllers/authorization'
import { GoogleService } from '@app/services/authorization'

import { EnvironmentConfigModule, TokenModule, UserModule } from '@modules/common'
import { AuthModule } from '@modules/authorization'

@Module({
  imports: [AuthModule, EnvironmentConfigModule, UserModule, TokenModule],
  controllers: [GoogleController],
  providers: [GoogleService],
  exports: [GoogleService]
})
export class GoogleModule {}
