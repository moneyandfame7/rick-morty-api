import { Module } from '@nestjs/common'

import { AuthModule } from './auth.module'
import { GithubController } from '@app/controllers/auth/github.controller'
import { GithubService } from '@app/services/auth/github.service'

import { EnvironmentConfigModule } from '@modules/common/environment-config.module'

import { UserModule } from '@modules/common/user.module'
import { TokenModule } from '@modules/common/token.module'

@Module({
  imports: [AuthModule, EnvironmentConfigModule, UserModule, TokenModule],
  controllers: [GithubController],
  providers: [GithubService],
  exports: [GithubService]
})
export class GithubModule {}
