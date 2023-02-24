import { Module } from '@nestjs/common'

import { GithubController } from '@app/controllers/authorization'
import { GithubService } from '@app/services/authorization'

import { EnvironmentConfigModule, TokenModule, UserModule } from '@modules/common'
import { AuthModule } from '@modules/authorization'

@Module({
  imports: [AuthModule, EnvironmentConfigModule, UserModule, TokenModule],
  controllers: [GithubController],
  providers: [GithubService],
  exports: [GithubService]
})
export class GithubModule {}
