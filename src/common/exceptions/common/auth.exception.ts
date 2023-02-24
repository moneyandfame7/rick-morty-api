import { UnauthorizedException, UnprocessableEntityException } from '@nestjs/common'

export class AuthIncorrectEmailException extends UnauthorizedException {
  public constructor() {
    super('Incorrect email address')
  }
}

export class AuthIncorrectPasswordException extends UnauthorizedException {
  public constructor() {
    super('Incorrect password')
  }
}

export class AuthEmailAlreadyBeenTaken extends UnprocessableEntityException {
  public constructor(email: string) {
    const errorResponse = {
      errors: {}
    }
    errorResponse.errors['email'] = `email "${email}  is already in use" `
    super()
  }
}
