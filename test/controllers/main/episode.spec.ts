import { Test, TestingModule } from '@nestjs/testing'

import { EpisodeController } from '@app/controllers/main'
import { EpisodeService } from '@app/services/main'

jest.mock('@common/decorators', () => ({
  ...jest.requireActual('@common/decorators'),
  ApiEntitiesOperation: () => jest.fn()
}))

describe('EpisodeController', () => {
  let controller: EpisodeController
  let counter = 0

  const mockRolesGuard = {}
  const mockEpisodeService = {
    createOne: jest.fn(dto => ({ id: ++counter, ...dto, createdAt: new Date() })),
    getMany: jest.fn(async (pagination, dto) => [
      { name: dto.name, episode: dto.episode },
      { name: dto.name, episode: dto.episode }
    ]),
    getOne: jest.fn(async id => ({ id, name: 'test' })),
    updateOne: jest.fn(async (id, dto) => ({ id, ...dto })),
    removeOne: jest.fn(async id => ({ id, name: 'test' }))
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EpisodeController],
      providers: [{ provide: EpisodeService, useValue: mockEpisodeService }]
    }).compile()

    controller = module.get<EpisodeController>(EpisodeController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should create a new episode', async () => {
    const createDto: any = { name: 'test', episode: 'episode' }

    const result = await controller.createOne(createDto)

    expect(mockEpisodeService.createOne).toHaveBeenCalledWith({ name: 'test', episode: 'episode' })
    expect(result).toStrictEqual({ id: expect.any(Number), ...createDto, createdAt: expect.any(Date) })
  })

  it('should get all the episodes', async () => {
    const query: any = {
      name: 'test',
      episode: 'episode',
      skip: null
    }
    const req: any = {
      originalUrl: 'episodes?name=test'
    }
    const result = await controller.getMany(query, req)
    expect(mockEpisodeService.getMany).toHaveBeenCalledWith(
      {
        otherQuery: 'name=test',
        endpoint: 'episodes',
        skip: null
      },
      {
        name: 'test',
        episode: 'episode'
      }
    )
    expect(result).toStrictEqual([
      {
        name: 'test',
        episode: 'episode'
      },
      {
        name: 'test',
        episode: 'episode'
      }
    ])
  })

  it('should get one episode with specified id', async () => {
    const id = 1337
    const result = await controller.getOne(id)

    expect(mockEpisodeService.getOne).toHaveBeenCalledWith(id)

    expect(result).toStrictEqual({ id: 1337, name: 'test' })
  })

  it('should update the episode with specified id', async () => {
    const id = 228
    const updDto = { name: 'nigga' }
    const result = await controller.updateOne(id, updDto)

    expect(mockEpisodeService.updateOne).toHaveBeenCalledWith(id, updDto)
    expect(result).toStrictEqual({ id, ...updDto })
  })

  it('should remove the episode with specified id', async () => {
    const id = 1333

    const result = await controller.removeOne(id)

    expect(mockEpisodeService.removeOne).toHaveBeenCalledWith(id)
    expect(result).toStrictEqual({ id, name: 'test' })
  })
})
