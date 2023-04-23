import { Injectable } from '@nestjs/common'
import { PutObjectCommand, type PutObjectCommandInput, S3Client } from '@aws-sdk/client-s3'
import * as sharp from 'sharp'

import { EnvironmentConfigService } from '@app/services/common'

@Injectable()
export class S3Service {
  private readonly s3: S3Client
  private readonly bucketUrl: string
  public readonly bucketName: string

  public constructor(private readonly config: EnvironmentConfigService) {
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

  private async generateParams(file: Express.Multer.File, name: string): Promise<PutObjectCommandInput> {
    const [, type] = file.mimetype.split('/')
    const fileBuffer = await sharp(file.buffer).toBuffer()

    const params: PutObjectCommandInput = {
      Bucket: this.bucketName,
      Key: `${name}.${type}`,
      Body: fileBuffer,
      ContentType: file.mimetype,
      ACL: 'public-read'
    }
    return params
  }

  public async upload(file: Express.Multer.File, name: string): Promise<string> {
    const params = await this.generateParams(file, name)
    const command = new PutObjectCommand(params)

    return this.s3.send(command).then(() => `${this.bucketUrl}/${params.Key}`)
  }
}
