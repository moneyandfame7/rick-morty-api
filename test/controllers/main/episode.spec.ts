import { Test, TestingModule } from '@nestjs/testing'

import { EpisodeController } from '@app/controllers/main'
import { EpisodeService } from '@app/services/main'
import { mockCreateEpisodeDto, mockEpisodeService } from '../../utils/mock/main/episode.mock'
import { QueryEpisodeDto } from '@infrastructure/dto/main'
import { ORDER } from '@common/constants'

jest.mock('@common/decorators', () => ({
  ...jest.requireActual('@common/decorators'),
  ApiEntitiesOperation: () => jest.fn()
}))

describe('[Episode] Controller', () => {
  let controller: EpisodeController
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

  it('should return a promise', async () => {
    const id = 255

    const result = controller.getOne(id)
    expect(mockEpisodeService.getOne).toHaveBeenCalledWith(id)
    expect(result).toBeInstanceOf(Promise)
  })

  it('[CREATE] - should return a created episode', async () => {
    const result = await controller.createOne(mockCreateEpisodeDto)

    expect(mockEpisodeService.createOne).toHaveBeenCalledWith(mockCreateEpisodeDto)
    expect(result).toStrictEqual({ id: expect.any(Number), ...mockCreateEpisodeDto, createdAt: expect.any(Date) })
  })

  it('[GET MANY] - should return page info and results [array of episodes]', async () => {
    const query = new QueryEpisodeDto()
    query.name = 'Fucking Episode'
    query.order = ORDER.DESC
    query.page = 25
    query.episode = 'EPFUCK03123'
    const req: any = {
      originalUrl: 'episodes?name=Fucking+Episode'
    }
    const result = await controller.getMany(query, req)
    expect(mockEpisodeService.getMany).toHaveBeenCalledWith(
      {
        order: ORDER.DESC,
        otherQuery: 'name=Fucking+Episode',
        page: 25,
        endpoint: 'episodes',
        take: 20,
        skip: 480 // (page-1) * take
      },
      {
        name: 'Fucking Episode',
        episode: 'EPFUCK03123'
      }
    )
    expect(result.results).toBeInstanceOf(Array)
    expect(result.info).toBeInstanceOf(Object)
  })

  it('[GET ONE] - should return episode width id: 1337', async () => {
    const id = 1337
    const result = await controller.getOne(id)

    expect(mockEpisodeService.getOne).toHaveBeenCalledWith(id)
    expect(result).toHaveProperty('id', 1337)
  })

  it('[UPDATE] - should remove updated episode with id: 228', async () => {
    const id = 228
    const updDto = { name: 'nigga' }
    const result = await controller.updateOne(id, updDto)

    expect(mockEpisodeService.updateOne).toHaveBeenCalledWith(id, updDto)
    expect(result).toStrictEqual({ id, ...updDto })
  })

  it('[REMOVE] - should return a removed episode with id: 1333', async () => {
    const id = 1333

    const result = await controller.removeOne(id)

    expect(mockEpisodeService.removeOne).toHaveBeenCalledWith(id)
    expect(result).toStrictEqual({ id, name: 'test' })
  })
})
