import { Injectable } from '@nestjs/common'
import { PutObjectCommand, type PutObjectCommandInput, S3Client } from '@aws-sdk/client-s3'
import { EnvironmentConfigService } from '@config/environment-config.service'

@Injectable()
export class S3Service {
  private readonly s3: S3Client
  private readonly bucketUrl: string
  public readonly bucketName: string

  constructor(private readonly config: EnvironmentConfigService) {
    this.s3 = new S3Client({
      credentials: {
        accessKeyId: config.getS3BucketAccessKey(),
        secretAccessKey: config.getS3BucketAccessSecret()
      },
      region: config.getS3BucketRegion()
    })
    this.bucketName = config.getS3BucketName()
    this.bucketUrl = config.getS3BucketUrl()
  }

  public async upload(params: PutObjectCommandInput): Promise<string> {
    const command = new PutObjectCommand(params)
    const url = await this.s3.send(command).then(() => `${this.bucketUrl}/${params.Key}`)

    console.log(`Image was uploaded to ${url}`)
    return url
  }
}
