import { HttpException, HttpStatus, Injectable } from '@nestjs/common'

import { ApiErrorService } from '@app/services/common'

@Injectable()
export class UserException {
  public constructor(private readonly apiErrorService: ApiErrorService) {}

  public manyNotFound(): HttpException {
    return this.apiErrorService.throwErrorResponse('Users not found', HttpStatus.NOT_FOUND)
  }

  public notFound(): HttpException {
    return this.apiErrorService.throwErrorResponse('User not found', HttpStatus.NOT_FOUND)
  }

  public withIdNotFound(id: string): HttpException {
    return this.apiErrorService.throwErrorResponse(`User with id ${id} not found`, HttpStatus.NOT_FOUND)
  }

  public alreadyExistsWithEmail(email: string): HttpException {
    return this.apiErrorService.throwErrorResponse(`User with email ${email} already exists`, HttpStatus.CONFLICT)
  }

  public alreadyExistsWithUsername(username: string): HttpException {
    return this.apiErrorService.throwErrorResponse(`User with username ${username} already exists`, HttpStatus.CONFLICT)
  }
}
