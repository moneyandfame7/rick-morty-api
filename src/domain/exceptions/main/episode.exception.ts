import { NotFoundException, UnprocessableEntityException } from '@nestjs/common'

export class EpisodesNotFoundException extends NotFoundException {
  constructor() {
    super('Episodes not found')
  }
}

export class EpisodeWithIdNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Episode with id ${id} not found`)
  }
}

export class EpisodeAlreadyExistException extends UnprocessableEntityException {
  constructor(name: string) {
    super(`Episode ${name} already exists`)
  }
}
