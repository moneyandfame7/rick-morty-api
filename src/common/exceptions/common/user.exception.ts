import { HttpException, HttpStatus, Injectable } from '@nestjs/common'

import { ApiErrorService } from '@app/services/common'

@Injectable()
export class UserException {
  public constructor(private readonly apiErrorService: ApiErrorService) {}

  public manyNotFound(): HttpException {
    return this.apiErrorService.throwErrorResponse('users', 'Users not found', HttpStatus.NOT_FOUND)
  }

  public notFound(): HttpException {
    return this.apiErrorService.throwErrorResponse('user', 'User not found', HttpStatus.NOT_FOUND)
  }

  public withIdNotFound(id: string): HttpException {
    return this.apiErrorService.throwErrorResponse('id', `User with id ${id} not found`, HttpStatus.NOT_FOUND)
  }

  public alreadyExistsWithEmail(email: string): HttpException {
    return this.apiErrorService.throwErrorResponse('value', `User with email ${email} already exists`, HttpStatus.UNPROCESSABLE_ENTITY)
  }

  public alreadyExistsWithUsername(username: string): HttpException {
    return this.apiErrorService.throwErrorResponse('username', `User with username ${username} already exists`, HttpStatus.UNPROCESSABLE_ENTITY)
  }
}
