import { Location } from '@infrastructure/entities/main'
import { CreateLocationDto } from '@infrastructure/dto/main'
import { ConflictException, NotFoundException } from '@nestjs/common'

export const MOCK_LOCATION_COUNT = 33

export const mockCreateLocationDto: CreateLocationDto = {
  name: 'Earth (C-137)',
  type: 'Planet',
  dimension: 'Dimension C-137'
}
export const mockExistLocation: Location = {
  id: 1,
  name: 'Earth (C-137)',
  type: 'Planet',
  dimension: 'Dimension C-137',
  residents: [],
  createdAt: new Date()
}

export const mockLocationService = {
  createOne: jest.fn(async dto => ({
    id: expect.any(Number),
    ...dto,
    createdAt: new Date()
  })),
  getMany: jest.fn(async (pagination, dto) => ({
    info: { ...pagination },
    results: [{ name: dto.name, type: dto.type }]
  })),
  getOne: jest.fn(async id => ({
    id,
    name: 'Earth (C-137)'
  })),
  updateOne: jest.fn(async (id, dto) => ({
    id,
    ...dto
  })),
  removeOne: jest.fn(async id => ({
    id,
    name: 'Earth (C-137)'
  })),
  getCount: jest.fn().mockResolvedValue(MOCK_LOCATION_COUNT)
}

export const mockLocationRepository = {
  findOneBy: jest.fn(),
  getMany: jest.fn(),
  getOne: jest.fn(),
  create: jest.fn(async dto => dto),
  updateOne: jest.fn(async (id, dto) => ({
    id,
    ...dto
  })),
  save: jest.fn(async char => ({
    id: expect.any(Number),
    ...char,
    createdAt: new Date()
  })),
  removeOne: jest.fn(async id => ({ id, name: 'test' })),
  getCount: jest.fn().mockResolvedValue(MOCK_LOCATION_COUNT)
}

export const mockLocationException = {
  alreadyExists: jest.fn(name => {
    throw new ConflictException(`Location ${name} already exists`)
  }),
  manyNotFound: jest.fn(() => {
    throw new NotFoundException('Many not found')
  }),
  withIdNotFound: jest.fn(id => {
    throw new NotFoundException(`With id ${id} not found`)
  })
}
