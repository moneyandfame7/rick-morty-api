import { type HttpException, HttpStatus, Injectable } from '@nestjs/common'

import { ApiErrorService } from '@app/services/common'

@Injectable()
export class AuthorizationException {
  public constructor(private readonly apiErrorService: ApiErrorService) {}

  public incorrectEmail(): HttpException {
    return this.apiErrorService.throwErrorResponse('email', 'Incorrect email', HttpStatus.BAD_REQUEST)
  }

  public incorrectPassword(): HttpException {
    return this.apiErrorService.throwErrorResponse('password', `Incorrect password`, HttpStatus.BAD_REQUEST)
  }

  public alreadyUsedEmail(email: string): HttpException {
    return this.apiErrorService.throwErrorResponse('email', `Email "${email}  is already in use`, HttpStatus.BAD_REQUEST)
  }

  public incorrectVerificationLink(): HttpException {
    return this.apiErrorService.throwErrorResponse('link', 'Invalid verification link', HttpStatus.BAD_REQUEST)
  }

  public alreadyVerified(): HttpException {
    return this.apiErrorService.throwErrorResponse('link', 'Already verified', HttpStatus.BAD_REQUEST)
  }

  public passwordIsEqualToOld(): HttpException {
    return this.apiErrorService.throwErrorResponse('password', 'Password is equal to old password', HttpStatus.BAD_REQUEST)
  }

  public passwordDontMatch(): HttpException {
    return this.apiErrorService.throwErrorResponse('password', "Passwords don't match", HttpStatus.BAD_REQUEST)
  }
}
