import { HttpException, HttpStatus, Injectable } from '@nestjs/common'

import { ApiErrorService } from '@app/services/common'
import { HttpStack } from '@common/constants'

@Injectable()
export class UserException {
  public constructor(private readonly apiErrorService: ApiErrorService) {}

  public manyNotFound(): HttpException {
    return this.apiErrorService.throwErrorResponse('Users not found', HttpStatus.NOT_FOUND)
  }

  public notFound(): HttpException {
    return this.apiErrorService.throwErrorResponse('User not found', HttpStatus.NOT_FOUND)
  }

  public withIdNotFound(): HttpException {
    return this.apiErrorService.throwDemo(HttpStatus.NOT_FOUND, HttpStack.ID_NOT_FOUND, `User with same id not found`)
  }

  public incorrectPassword(): HttpException {
    return this.apiErrorService.throwDemo(HttpStatus.BAD_REQUEST, HttpStack.INCORRECT_PASSWORD, 'Incorrect password')
  }

  public passwordIsEqualToOld(): HttpException {
    return this.apiErrorService.throwDemo(HttpStatus.BAD_REQUEST, HttpStack.PASSWORD_IS_EQUAL_OLD, `Password is equal to old password`)
  }

  public passwordsDontMatch(): HttpException {
    return this.apiErrorService.throwDemo(HttpStatus.BAD_REQUEST, HttpStack.PASSWORDS_DONT_MATCH, 'Passwords dont match')
  }

  public alreadyExistsWithEmail(email: string): HttpException {
    return this.apiErrorService.throwErrorResponse(`User with email ${email} already exists`, HttpStatus.CONFLICT)
  }

  public alreadyExistsWithUsername(username: string): HttpException {
    return this.apiErrorService.throwErrorResponse(`User with username ${username} already exists`, HttpStatus.CONFLICT)
  }
}
