import { NotFoundException, UnprocessableEntityException } from '@nestjs/common'

export class CharactersNotFoundException extends NotFoundException {
  constructor() {
    super('Characters not found')
  }
}

export class CharacterWithIdNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Character with id ${id} not found`)
  }
}

export class CharacterAlreadyExistException extends UnprocessableEntityException {
  constructor(name: string) {
    super(`Episode ${name} already exists`)
  }
}
