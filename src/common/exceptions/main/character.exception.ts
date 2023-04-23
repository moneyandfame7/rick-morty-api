import { HttpException, HttpStatus, Injectable } from '@nestjs/common'

import { ApiErrorService } from '@app/services/common'
import { HttpStack } from '@common/constants'

@Injectable()
export class CharacterException {
  public constructor(private readonly apiErrorService: ApiErrorService) {}

  public manyNotFound(): HttpException {
    return this.apiErrorService.throwDemo(HttpStatus.NOT_FOUND, HttpStack.CHARACTERS_NOT_FOUND, 'There are no characters with such characteristics')
  }

  public withIdNotFound(id: number): HttpException {
    return this.apiErrorService.throwErrorResponse(`Character with ${id} not found`, HttpStatus.NOT_FOUND)
  }

  public alreadyExists(): HttpException {
    return this.apiErrorService.throwDemo(HttpStatus.CONFLICT, HttpStack.CHARACTER_EXIST, 'Character with similar characteristics already exists')
  }

  public emptyFile(): HttpException {
    return this.apiErrorService.throwDemo(HttpStatus.BAD_REQUEST, HttpStack.EMPTY_FILE, 'Image not provided')
  }
}
