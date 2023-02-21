import { NotFoundException, UnprocessableEntityException } from '@nestjs/common'

export class UsersNotFoundException extends NotFoundException {
  constructor() {
    super('Users not found')
  }
}

export class UserWithIdNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`User with ${id} not found`)
  }
}

export class UserDoesNotExistException extends UnprocessableEntityException {
  constructor() {
    super('User does not exist')
  }
}

export class UserWithEmailAlreadyExistsException extends UnprocessableEntityException {
  constructor(email: string) {
    console.log('puk')
    super(`User with email ${email} already exists`)
  }
}

export class UserWithUsernameAlreadyExistsException extends UnprocessableEntityException {
  constructor(username: string) {
    super(`User with username ${username} already exists`)
  }
}
