import { Module } from '@nestjs/common'

import { S3Service } from '@app/services/common'

import { EnvironmentConfigModule } from '@modules/common'

@Module({
  imports: [EnvironmentConfigModule],
  providers: [S3Service],
  exports: [S3Service]
})
export class S3Module {}
