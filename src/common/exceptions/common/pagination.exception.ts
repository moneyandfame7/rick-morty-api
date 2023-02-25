import { HttpException, HttpStatus, Injectable } from '@nestjs/common'

import { ApiErrorService } from '@app/services/common'

@Injectable()
export class PaginationException {
  public constructor(private readonly apiErrorService: ApiErrorService) {}

  public notFound(page: number): HttpException {
    return this.apiErrorService.throwErrorResponse('page', `page ${page} not found`, HttpStatus.NOT_FOUND)
  }
}
