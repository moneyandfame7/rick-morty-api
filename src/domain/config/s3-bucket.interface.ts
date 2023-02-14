export interface S3BucketConfig {
  getS3BucketName(): string
  getS3BucketRegion(): string
  getS3BucketAccessKey(): string
  getS3BucketAccessSecret(): string
  getS3BucketUrl(): string
}
