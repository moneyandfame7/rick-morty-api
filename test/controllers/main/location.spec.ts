import { Test, TestingModule } from '@nestjs/testing'

import { LocationService } from '@app/services/main'
import { LocationController } from '@app/controllers/main'
import { QueryLocationDto, UpdateLocationDto } from '@app/dto/main'

import { ORDER } from '@common/constants'

import { mockLocationService } from '../../utils/mock/main/location.mock'

jest.mock('@common/decorators', () => ({
  ...jest.requireActual('@common/decorators'),
  ApiEntitiesOperation: () => jest.fn()
}))

describe('[Location] Controller', () => {
  let controller: LocationController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationController],
      providers: [{ provide: LocationService, useValue: mockLocationService }]
    }).compile()

    controller = module.get<LocationController>(LocationController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('[CREATE] - should return a created location', async () => {
    const dto: any = {
      name: 'test',
      type: 'test'
    }
    const result = await controller.createOne(dto)
    expect(mockLocationService.createOne).toHaveBeenCalledWith({ name: 'test', type: 'test' })
    expect(result).toStrictEqual({
      id: expect.any(Number),
      name: 'test',
      type: 'test',
      createdAt: expect.any(Date)
    })
  })

  it('[GET MANY] - should return page info and results [array of locations]', async () => {
    const query = new QueryLocationDto()
    query.name = 'Location'
    query.type = 'Primary'
    query.order = ORDER.DESC
    const req: any = {
      originalUrl: 'location?name=Location&type=Primary'
    }

    const result = await controller.getMany(query, req)
    expect(mockLocationService.getMany).toHaveBeenCalledWith(
      {
        otherQuery: 'name=Location&type=Primary',
        endpoint: 'locations',
        order: ORDER.DESC,
        page: 1,
        skip: 0,
        take: 20
      },
      {
        name: 'Location',
        type: 'Primary'
      }
    )

    expect(result.results).toBeInstanceOf(Array)
    expect(result.info).toBeInstanceOf(Object)
  })

  it('[GET ONE] - should return location with id: 5', async () => {
    const id = 5

    const result = await controller.getOne(id)

    expect(mockLocationService.getOne).toHaveBeenCalledWith(5)
    expect(result).toHaveProperty('id', 5)
  })

  it('[UPDATE} - should updated location with id: 6', async () => {
    const id = 6
    const dto: UpdateLocationDto = {
      name: 'upd',
      type: 'upd'
    }

    const result = await controller.updateOne(id, dto)

    expect(mockLocationService.updateOne).toHaveBeenCalledWith(6, { name: 'upd', type: 'upd' })
    expect(result).toStrictEqual({ id: 6, name: 'upd', type: 'upd' })
  })

  it('[REMOVE] - should return a removed location with id: 5', async () => {
    const id = 5
    const result = await controller.removeOne(id)

    expect(mockLocationService.removeOne).toHaveBeenCalledWith(5)
    expect(result).toHaveProperty('id', 5)
  })
})
