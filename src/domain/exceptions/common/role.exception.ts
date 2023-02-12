import { BadRequestException, NotFoundException } from '@nestjs/common'

export class RoleDoesNotExistException extends BadRequestException {
  constructor(value: string) {
    super(`Role ${value} does not exist`)
  }
}
export class RolesNotFoundExcetion extends NotFoundException {
  constructor() {
    super('Roles not found')
  }
}
export class RoleAlreadyExistException extends BadRequestException {
  constructor(value: string) {
    super(`Role ${value} already exists`)
  }
}
