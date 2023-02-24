import { BadRequestException, NotFoundException } from '@nestjs/common'

export class RoleDoesNotExistException extends BadRequestException {
  public constructor(value: string) {
    super(`Role ${value} does not exist`)
  }
}
export class RolesNotFoundException extends NotFoundException {
  public constructor() {
    super('Roles not found')
  }
}
export class RoleAlreadyExistException extends BadRequestException {
  public constructor(value: string) {
    super(`Role ${value} already exists`)
  }
}
