import { ConflictException, NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'

import { PaginationService } from '@app/services/common'
import { LocationService } from '@app/services/main'
import { QueryPaginationDto } from '@app/dto/common'

import { LocationRepository } from '@infrastructure/repositories/main'

import { LocationException } from '@common/exceptions/main'
import { ORDER } from '@common/constants'

import { mockPaginationService } from '../../utils/mock/common'
import { MOCK_LOCATION_COUNT, mockCreateLocationDto, mockExistLocation, mockLocationException, mockLocationRepository } from '../../utils/mock/main/location.mock'

describe('[Location] Service', () => {
  let service: LocationService

  beforeEach(async () => {
    mockLocationRepository.findOneBy = jest.fn().mockResolvedValue(null)

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationService,
        { provide: LocationException, useValue: mockLocationException },
        { provide: PaginationService, useValue: mockPaginationService },
        { provide: LocationRepository, useValue: mockLocationRepository }
      ]
    }).compile()
    service = module.get<LocationService>(LocationService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('[CREATE]', () => {
    it('should thrown an error if the location already exists', async () => {
      let result: any

      mockLocationRepository.findOneBy = jest.fn().mockResolvedValue(mockExistLocation)
      try {
        result = await service.createOne(mockCreateLocationDto)
      } catch (e) {
        expect(result).toBeUndefined()
        expect(mockLocationException.alreadyExists).toHaveBeenCalledWith(mockExistLocation.name)
        expect(e).toBeInstanceOf(ConflictException)
        expect(e.response).toHaveProperty('message', `Location ${mockExistLocation.name} already exists`)
      }
    })

    it('should successfully create the location', async () => {
      const result = await service.createOne(mockCreateLocationDto)

      expect(result).toEqual({
        id: expect.any(Number),
        ...mockCreateLocationDto,
        createdAt: expect.any(Date)
      })
    })
  })

  describe('[GET MANY]', () => {
    const queryPaginationDto = new QueryPaginationDto()
    queryPaginationDto.order = ORDER.DESC
    queryPaginationDto.otherQuery = 'name=Earth'
    queryPaginationDto.endpoint = 'locations'
    queryPaginationDto.page = 13
    const queryLocationDto: any = { name: 'Earth' }
    it('should throw an error if locations is not found', async () => {
      mockLocationRepository.getMany = jest.fn().mockResolvedValue({ locations: [], count: 0 })

      let result

      try {
        result = await service.getMany(queryPaginationDto, queryLocationDto)
      } catch (e) {
        expect(result).toBeUndefined()
        expect(mockLocationException.manyNotFound).toHaveBeenCalled()
        expect(e).toBeInstanceOf(NotFoundException)
        expect(e.response).toHaveProperty('message', 'Many not found')
      }
    })

    it('should successfully return locations with page info', async () => {
      mockLocationRepository.getMany = jest.fn((queryPaginationDto, queryLocationDto) => ({
        locations: expect.any(Array),
        count: expect.any(Number)
      }))

      const result = await service.getMany(queryPaginationDto, queryLocationDto)

      expect(result).toStrictEqual({
        info: {
          order: ORDER.DESC,
          page: 13,
          take: 20,
          otherQuery: 'name=Earth',
          endpoint: 'locations',
          count: expect.any(Number)
        },
        results: expect.any(Array)
      })
      expect(mockPaginationService.buildPaginationInfo).toBeCalledWith({
        queryPaginationDto,
        count: expect.any(Number)
      })
      expect(mockPaginationService.wrapEntityWithPaginationInfo).toBeCalledWith(result.results, result.info)
    })
  })

  describe('[GET ONE] with id: 75', () => {
    const id = 75
    it('should thrown an error if the location is not found', async () => {
      mockLocationRepository.getOne = jest.fn().mockResolvedValue(null)
      let result
      try {
        result = await service.getOne(id)
      } catch (e) {
        expect(result).toBeUndefined()
        expect(e).toBeInstanceOf(NotFoundException)
        expect(mockLocationException.withIdNotFound).toHaveBeenCalledWith(id)
        expect(e.response).toHaveProperty('message', `With id ${id} not found`)
      }
    })

    it('should successfully return location', async () => {
      mockLocationRepository.getOne = jest.fn().mockResolvedValue({ id, name: 'test' })

      const result = await service.getOne(75)

      expect(result).toStrictEqual({
        id,
        name: 'test'
      })
      expect(mockLocationRepository.getOne).toHaveBeenCalledWith(id)
    })
  })

  describe('[UPDATE] with id: 35', () => {
    const id = 35
    const updLocationDto = {
      name: 'upd test'
    }
    it('should thrown an error if the location is not found', async () => {
      mockLocationRepository.getOne = jest.fn().mockResolvedValue(null)

      let result

      try {
        result = await service.updateOne(id, updLocationDto)
      } catch (e) {
        expect(result).toBeUndefined()
        expect(e).toBeInstanceOf(NotFoundException)
        expect(e.response).toHaveProperty('message', `With id ${id} not found`)
        expect(mockLocationException.withIdNotFound).toHaveBeenCalledWith(id)
      }
    })

    it('should successfully update the location', async () => {
      mockLocationRepository.getOne = jest.fn().mockResolvedValue({ id, name: 'test' })

      const result = await service.updateOne(id, updLocationDto)

      expect(result).toStrictEqual({
        id,
        name: 'upd test'
      })
      expect(mockLocationRepository.getOne).toHaveBeenCalledWith(id)
    })
  })

  describe('[REMOVE] with id: 25', () => {
    const id = 25

    it('should throws an error if the location not found', async () => {
      let result: any
      mockLocationRepository.getOne = jest.fn().mockResolvedValue(null)
      try {
        result = await service.removeOne(id)
      } catch (e) {
        expect(result).toBeUndefined()
        expect(e).toBeInstanceOf(NotFoundException)
        expect(mockLocationException.withIdNotFound).toBeCalledWith(id)
        expect(e.response).toHaveProperty('message', `With id ${id} not found`)
      }
    })

    it('should successfully remove the location', async () => {
      mockLocationRepository.getOne = jest.fn(id => ({ id, name: 'test' }))

      const result = await service.removeOne(id)
      expect(mockLocationRepository.getOne).toHaveBeenCalledWith(id)
      expect(result).toStrictEqual({
        id,
        name: 'test'
      })
    })
  })

  it('should return count of locations', async () => {
    const result = await service.getCount()

    expect(result).toEqual(MOCK_LOCATION_COUNT)
  })
})
