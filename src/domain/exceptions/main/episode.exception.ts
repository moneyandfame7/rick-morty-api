import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ApiErrorService } from '@services/common/api-error.service'

@Injectable()
export class EpisodeException {
  public constructor(private readonly apiErrorService: ApiErrorService) {}

  public manyNotFound(): HttpException {
    return this.apiErrorService.throwErrorResponse('episode', 'Episodes not found', HttpStatus.NOT_FOUND)
  }

  public withIdNotFound(id: number): HttpException {
    return this.apiErrorService.throwErrorResponse('episode', `Episode with ${id} not found`, HttpStatus.NOT_FOUND)
  }

  public alreadyExists(name: string): HttpException {
    return this.apiErrorService.throwErrorResponse('episode', `Episode with name ${name} already exists`, HttpStatus.UNPROCESSABLE_ENTITY)
  }

  //
  // public emptyFile(): HttpException {
  //   return this.apiErrorService.throwErrorResponse('file', 'The field file cannot be empty', HttpStatus.UNPROCESSABLE_ENTITY)
  // }
}
