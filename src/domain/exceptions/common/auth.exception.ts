import { UnauthorizedException } from '@nestjs/common'

export class AuthIncorrectEmailException extends UnauthorizedException {
  constructor() {
    super('Incorrect email address')
  }
}

export class AuthIncorrectPasswordException extends UnauthorizedException {
  constructor() {
    super('Incorrect password')
  }
}
