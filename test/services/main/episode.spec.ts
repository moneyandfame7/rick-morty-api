import { Test, TestingModule } from '@nestjs/testing'
import { ConflictException, NotFoundException } from '@nestjs/common'

import { EpisodeService } from '@app/services/main'
import { PaginationService } from '@app/services/common'
import { QueryPaginationDto } from '@app/dto/common'

import { EpisodeRepository } from '@infrastructure/repositories/main'

import { EpisodeException } from '@common/exceptions/main'
import { ORDER } from '@common/constants'

import { MOCK_EPISODE_COUNT, mockCreateEpisodeDto, mockEpisodeException, mockEpisodeRepository, mockExistEpisode } from '../../utils/mock/main/episode.mock'
import { mockPaginationService } from '../../utils/mock/common'
import { UpdateEpisodeDto } from '@app/dto/main'

describe('[Episode] Service', () => {
  let service: EpisodeService
  beforeEach(async () => {
    mockEpisodeRepository.findOneBy = jest.fn()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EpisodeService,
        { provide: EpisodeRepository, useValue: mockEpisodeRepository },
        { provide: PaginationService, useValue: mockPaginationService },
        { provide: EpisodeException, useValue: mockEpisodeException }
      ]
    }).compile()
    service = module.get<EpisodeService>(EpisodeService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('[CREATE]', () => {
    it('should thrown an error if the episode already exists', async () => {
      let result: any
      mockEpisodeRepository.findOneBy = jest.fn().mockResolvedValue(mockExistEpisode)

      try {
        result = await service.createOne(mockExistEpisode)
      } catch (e) {
        expect(result).toBeUndefined()
        expect(mockEpisodeException.alreadyExists).toBeCalledWith(mockExistEpisode.name)
        expect(e).toBeInstanceOf(ConflictException)
        expect(e.response).toHaveProperty('message', 'Already exists')
      }
    })

    it('should successfully create the episode', async () => {
      mockEpisodeRepository.findOneBy = jest.fn().mockResolvedValue(null)

      const result = await service.createOne(mockCreateEpisodeDto)
      expect(result).toStrictEqual({
        id: expect.any(Number),
        ...mockCreateEpisodeDto,
        createdAt: expect.any(Date)
      })
    })
  })

  describe('[GET MANY]', () => {
    const queryPaginationDto = new QueryPaginationDto()
    queryPaginationDto.order = ORDER.DESC
    queryPaginationDto.otherQuery = 'name=primary'
    queryPaginationDto.endpoint = 'episodes'
    queryPaginationDto.page = 25
    const queryEpisodeDto: any = { name: 'primary' }
    it('should thrown an error if episodes is not found', async () => {
      mockEpisodeRepository.getMany = jest.fn().mockReturnValue({ episodes: [], count: 0 })
      const paginationDto = new QueryPaginationDto()
      paginationDto.otherQuery = 'name=Primary'
      paginationDto.endpoint = 'episodes'
      const episodeDto: any = { name: 'Primary' }
      let result: any

      try {
        result = await service.getMany(paginationDto, episodeDto)
      } catch (e) {
        expect(result).toBeUndefined()
        expect(e).toBeInstanceOf(NotFoundException)
        expect(mockEpisodeException.manyNotFound).toHaveBeenCalled()
        expect(e.response).toHaveProperty('message', 'Many not found')
      }
    })

    it('should successfully return episodes with page info', async () => {
      mockEpisodeRepository.getMany = jest.fn((paginationDto, episodeDto) => ({
        episodes: [
          {
            id: expect.any(Number),
            name: episodeDto.name
          }
        ],
        count: 1
      }))
      const result = await service.getMany(queryPaginationDto, queryEpisodeDto)
      expect(result).toStrictEqual({
        info: {
          page: 25,
          endpoint: 'episodes',
          order: 'DESC',
          otherQuery: 'name=primary',
          count: 1,
          take: 20
        },
        results: [{ id: expect.any(Number), name: 'primary' }]
      })
      expect(mockPaginationService.buildPaginationInfo).toBeCalledWith({ queryPaginationDto, count: 1 })
      expect(mockPaginationService.wrapEntityWithPaginationInfo).toBeCalledWith(result.results, result.info)
    })
  })

  describe('[GET ONE] with id: 8', () => {
    const id = 8

    it('should throws an error if the episode is not found', async () => {
      let result: any
      mockEpisodeRepository.getOne = jest.fn().mockResolvedValue(null)

      try {
        result = await service.getOne(id)
      } catch (e) {
        expect(result).toBeUndefined()
        expect(e).toBeInstanceOf(NotFoundException)
        expect(mockEpisodeException.withIdNotFound).toBeCalledWith(id)
        expect(e.response).toHaveProperty('message', `With id ${id} not found`)
      }
    })

    it('should successfully return episode', async () => {
      mockEpisodeRepository.getOne = jest.fn().mockReturnValue({ id, name: 'test' })

      const result = await service.getOne(id)
      expect(result).toStrictEqual({
        id,
        name: 'test'
      })
      expect(mockEpisodeRepository.getOne).toHaveBeenCalledWith(id)
    })
  })

  describe('[UPDATE] with id: 3', () => {
    const id = 3
    const dto: UpdateEpisodeDto = {
      name: 'update test'
    }
    it('should throws an error if the episode is not found', async () => {
      mockEpisodeRepository.getOne = jest.fn().mockReturnValue(null)

      let result
      try {
        result = await service.updateOne(id, dto)
      } catch (e) {
        expect(result).toBeUndefined()
        expect(mockEpisodeException.withIdNotFound).toHaveBeenCalledWith(id)
        expect(e).toBeInstanceOf(NotFoundException)
        expect(e.response).toHaveProperty('message', `With id ${id} not found`)
      }
    })

    it('should successfully update the episode', async () => {
      mockEpisodeRepository.getOne = jest.fn().mockResolvedValue({ id, name: 'test' })

      const result = await service.updateOne(id, dto)
      expect(mockEpisodeRepository.getOne).toHaveBeenCalledWith(id)
      expect(result).toStrictEqual({
        id,
        ...dto
      })
    })
  })

  describe('[REMOVE] with id: 7', () => {
    const id = 7

    it('should throws an error if the episode not found', async () => {
      let result: any
      mockEpisodeRepository.getOne = jest.fn().mockResolvedValue(null)
      try {
        result = await service.removeOne(id)
      } catch (e) {
        expect(result).toBeUndefined()
        expect(e).toBeInstanceOf(NotFoundException)
        expect(mockEpisodeException.withIdNotFound).toBeCalledWith(id)
        expect(e.response).toHaveProperty('message', `With id ${id} not found`)
      }
    })

    it('should successfully remove the episode', async () => {
      mockEpisodeRepository.getOne = jest.fn(id => ({ id, name: 'test' }))

      const result = await service.removeOne(id)
      expect(mockEpisodeRepository.getOne).toHaveBeenCalledWith(id)
      expect(result).toStrictEqual({
        id,
        name: 'test'
      })
    })
  })

  it('should return count of episodes', async () => {
    const result = await service.getCount()

    expect(result).toStrictEqual(MOCK_EPISODE_COUNT)
  })
})
