import { ConflictException, NotFoundException, UnprocessableEntityException } from '@nestjs/common'
import { CreateCharacterDto } from '@infrastructure/dto/main'
import { Character, Location } from '@infrastructure/entities/main'

export const MOCK_CHARACTER_COUNT = 783
export const MOCK_CHARACTER_LENGTH = 3
export const MOCK_CHAR_ID = 73

export const mockCreateCharacterDto: CreateCharacterDto = {
  name: 'Rick Morty Scott',
  status: 'unknown',
  type: '',
  gender: 'unknown',
  species: 'unknown'
}

export const mockExistCharacter: Character = {
  id: 1,
  name: 'Rick Sanchez',
  type: '',
  status: 'Alive',
  gender: 'Male',
  species: 'Human',
  location: {} as Location,
  origin: {} as Location,
  image: 'http://test.com/characters/1.jpeg',
  episodes: [],
  createdAt: new Date()
}

export const mockCharacterService = {
  createOne: jest.fn(async dto => ({
    id: expect.any(Number),
    ...dto,
    createdAt: new Date()
  })),
  getMany: jest.fn(async (pagination, dto) => ({
    info: { ...pagination },
    results: [{ name: dto.name }]
  })),
  getOne: jest.fn(async id => ({
    id,
    name: 'Morty'
  })),
  updateOne: jest.fn(async (id, dto) => ({
    id,
    ...dto
  })),
  removeOne: jest.fn(async id => ({ id, name: 'removed' }))
}

export const mockCharacterRepository = {
  findOneBy: jest.fn(),
  getMany: jest.fn(),
  getOne: jest.fn(),
  createOne: jest.fn(dto => dto),
  updateOne: jest.fn((id, dto) => ({ id, ...dto })),
  save: jest.fn(character => ({
    id: expect.any(Number),
    ...character,
    createdAt: new Date()
  })),
  removeOne: jest.fn(id => ({
    id,
    name: 'test'
  })),
  getCount: jest.fn().mockResolvedValue(MOCK_CHARACTER_COUNT)
}

export const mockCharacterException = {
  emptyFile: jest.fn(() => {
    throw new UnprocessableEntityException('Empty file')
  }),
  alreadyExists: jest.fn(() => {
    throw new ConflictException('Already exists')
  }),
  manyNotFound: jest.fn(() => {
    throw new NotFoundException('Many not found')
  }),
  withIdNotFound: jest.fn(id => {
    throw new NotFoundException(`With id ${id} not found`)
  })
}
