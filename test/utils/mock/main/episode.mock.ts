import { ConflictException, NotFoundException } from '@nestjs/common'
import { Episode } from '@infrastructure/entities/main'
import { CreateEpisodeDto } from '@infrastructure/dto/main'

export const MOCK_EPISODE_COUNT = 63

export const mockCreateEpisodeDto: CreateEpisodeDto = {
  name: 'Fucking Peace',
  airDate: 'February 28, 2023',
  episode: 'S07E10'
}

export const mockExistEpisode: Episode = {
  id: 1,
  name: 'Pilot',
  airDate: 'December 2, 2013',
  episode: 'S01E01',
  characters: [],
  createdAt: new Date()
}

export const mockEpisodeService = {
  createOne: jest.fn(dto => ({
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
    name: 'test'
  })),
  updateOne: jest.fn(async (id, dto) => ({
    id,
    ...dto
  })),
  removeOne: jest.fn(async id => ({
    id,
    name: 'test'
  }))
}

export const mockEpisodeRepository = {
  findOneBy: jest.fn(),
  getMany: jest.fn(),
  getOne: jest.fn(),
  create: jest.fn(dto => dto),
  updateOne: jest.fn((id, dto) => ({
    id,
    ...dto
  })),
  save: jest.fn(char =>
    Promise.resolve({
      id: expect.any(Number),
      ...char,
      createdAt: new Date()
    })
  ),
  removeOne: jest.fn(id => ({
    id,
    name: 'test'
  })),
  getCount: jest.fn().mockResolvedValue(MOCK_EPISODE_COUNT)
}

export const mockEpisodeException = {
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
