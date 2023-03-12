import { type HttpException, HttpStatus, Injectable } from '@nestjs/common'

import { ApiErrorService } from '@app/services/common'
import { HttpCode } from '@common/constants'

@Injectable()
export class AuthorizationException {
  public constructor(private readonly apiErrorService: ApiErrorService) {}

  public incorrectEmail(): HttpException {
    // return this.apiErrorService.throwErrorResponse('Incorrect email.', HttpStatus.BAD_REQUEST)
    return this.apiErrorService.throwDemo(HttpCode.EMAIL_NOT_FOUND, 'Couldn’t find your account', HttpStatus.BAD_REQUEST)
  }

  public incorrectPassword(): HttpException {
    return this.apiErrorService.throwDemo(HttpCode.INCORRECT_PASSWORD, `Incorrect password.`, HttpStatus.BAD_REQUEST)
  }

  public alreadyUsedEmail(): HttpException {
    return this.apiErrorService.throwDemo(HttpCode.EMAIL_ALREADY_USED, `That email is taken. Try another.`, HttpStatus.BAD_REQUEST)
  }

  public incorrectVerificationLink(): HttpException {
    return this.apiErrorService.throwErrorResponse('Invalid verification link', HttpStatus.BAD_REQUEST)
  }

  public alreadyVerified(): HttpException {
    return this.apiErrorService.throwErrorResponse('Already verified', HttpStatus.BAD_REQUEST)
  }

  public passwordIsEqualToOld(): HttpException {
    return this.apiErrorService.throwErrorResponse('Password is equal to old password', HttpStatus.BAD_REQUEST)
  }

  public passwordDontMatch(): HttpException {
    return this.apiErrorService.throwErrorResponse("Passwords don't match", HttpStatus.BAD_REQUEST)
  }
}
