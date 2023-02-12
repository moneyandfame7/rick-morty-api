import { NotFoundException, UnprocessableEntityException } from '@nestjs/common'

export class LocationsNotFoundException extends NotFoundException {
  constructor() {
    super('Locations not found')
  }
}

export class LocationWithIdNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Location with id ${id} not found`)
  }
}

export class LocationAlreadyExistsException extends UnprocessableEntityException {
  constructor(name: string) {
    super(`Location ${name} already exists`)
  }
}
