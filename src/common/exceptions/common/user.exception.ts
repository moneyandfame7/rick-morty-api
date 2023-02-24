import { BadRequestException, NotFoundException } from '@nestjs/common'

export class UsersNotFoundException extends NotFoundException {
  public constructor() {
    super('Users not found')
  }
}

export class UserWithIdNotFoundException extends NotFoundException {
  public constructor(id: string) {
    super(`User with ${id} not found`)
  }
}

export class UserNotFoundException extends NotFoundException {
  public constructor() {
    super('User does not exist')
  }
}

export class UserWithEmailAlreadyExistsException extends BadRequestException {
  public constructor(email: string) {
    super(`User with email ${email} already exists`)
  }
}

export class UserWithUsernameAlreadyExistsException extends BadRequestException {
  public constructor(username: string) {
    super(`User with username ${username} already exists`)
  }
}
