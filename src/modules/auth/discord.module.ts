import { Module } from '@nestjs/common'

import { AuthModule } from './auth.module'
import { DiscordController } from '@app/controllers/auth/discord.controller'
import { DiscordService } from '@app/services/auth/discord.service'

import { EnvironmentConfigModule } from '@modules/common/environment-config.module'

import { UserModule } from '@modules/common/user.module'
import { TokenModule } from '@modules/common/token.module'

@Module({
  imports: [AuthModule, EnvironmentConfigModule, UserModule, TokenModule],
  controllers: [DiscordController],
  providers: [DiscordService],
  exports: [DiscordService]
})
export class DiscordModule {}
