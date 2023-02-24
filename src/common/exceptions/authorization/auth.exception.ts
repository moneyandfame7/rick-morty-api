import { type HttpException, HttpStatus, Injectable } from '@nestjs/common'

import { ApiErrorService } from '@app/services/common'

@Injectable()
export class AuthorizationException {
  public constructor(private readonly apiErrorService: ApiErrorService) {}

  public incorrectEmail(): HttpException {
    return this.apiErrorService.throwErrorResponse('email', 'Incorrect email', HttpStatus.UNAUTHORIZED)
  }

  public incorrectPassword(): HttpException {
    return this.apiErrorService.throwErrorResponse('password', `Incorrect password`, HttpStatus.UNAUTHORIZED)
  }

  public alreadyUsedEmail(email: string): HttpException {
    return this.apiErrorService.throwErrorResponse('email', `Email "${email}  is already in use`, HttpStatus.UNAUTHORIZED)
  }
}
