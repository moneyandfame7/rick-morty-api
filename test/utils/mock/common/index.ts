import 'dotenv/config'

export const mockS3Service = {
  upload: jest.fn(params => `${process.env.S3BUCKET_URL}/${params.Key}`),
  bucketName: process.env.S3BUCKET_URL
}

export const mockPaginationService = {
  buildPaginationInfo: jest.fn(({ queryPaginationDto, count }) => ({
    ...queryPaginationDto,
    count
  })),
  wrapEntityWithPaginationInfo: jest.fn((results, info) => ({
    results,
    info
  }))
}

export const mockSharp = {
  resize: jest.fn().mockReturnThis(),
  toBuffer: jest.fn().mockReturnValue(expect.any(Buffer))
}

export const mockExpressFile = {
  fieldname: 'image',
  originalname: '0e6cf1a1-8221-493d-8c0d-bfdc5f9a1d49.jpg',
  mimetype: 'image/jpeg',
  size: 100276,
  buffer: Buffer.from('asdasd')
} as Express.Multer.File
