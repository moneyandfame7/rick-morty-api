import { type HttpException, HttpStatus, Injectable } from '@nestjs/common'

import { ApiErrorService } from '@app/services/common'

@Injectable()
export class CharacterException {
  public constructor(private readonly apiErrorService: ApiErrorService) {}

  public manyNotFound(): HttpException {
    return this.apiErrorService.throwErrorResponse('Characters not found', HttpStatus.NOT_FOUND)
  }

  public withIdNotFound(id: number): HttpException {
    return this.apiErrorService.throwErrorResponse(`Character with ${id} not found`, HttpStatus.NOT_FOUND)
  }

  public alreadyExists(): HttpException {
    return this.apiErrorService.throwErrorResponse('Character with similar characteristics already exists', HttpStatus.CONFLICT)
  }

  public emptyFile(): HttpException {
    return this.apiErrorService.throwErrorResponse('The field "image" cannot be empty', HttpStatus.UNPROCESSABLE_ENTITY)
  }
}
