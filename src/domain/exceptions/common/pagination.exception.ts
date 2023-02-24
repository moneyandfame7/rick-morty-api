import { BadRequestException } from '@nestjs/common'

export class PageDoesNotExistException extends BadRequestException {
  public constructor(page: number) {
    super(`Page ${page} does not exist`)
  }
}
