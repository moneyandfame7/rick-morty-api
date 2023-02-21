import { Module } from '@nestjs/common'
import { AuthModule } from './auth.module'
import { DiscordController } from '@controllers/auth/discord.controller'
import { DiscordService } from '@services/auth/discord.service'
import { EnvironmentConfigModule } from '@config/environment-config.module'
import { UserModule } from '@modules/common/user.module'

@Module({
  imports: [AuthModule, EnvironmentConfigModule, UserModule],
  controllers: [DiscordController],
  providers: [DiscordService],
  exports: [DiscordService]
})
export class DiscordModule {}
