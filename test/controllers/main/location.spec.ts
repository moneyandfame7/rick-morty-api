import { LocationController } from '@app/controllers/main'
import { Test, TestingModule } from '@nestjs/testing'
import { LocationService } from '@app/services/main'

jest.mock('@common/decorators', () => ({
  ...jest.requireActual('@common/decorators'),
  ApiEntitiesOperation: () => jest.fn()
}))

describe('LocationController', () => {
  let controller: LocationController
  let counter = 0

  const mockLocationService = {
    createOne: jest.fn(async dto => ({ id: ++counter, ...dto, createdAt: new Date() })),
    getMany: jest.fn(async (pagination, dto) => [
      { name: dto.name, type: dto.type },
      { name: dto.name, type: dto.type }
    ]),
    getOne: jest.fn(async id => ({ id, name: 'test' })),
    updateOne: jest.fn(async (id, dto) => ({ id, ...dto })),
    removeOne: jest.fn(async id => ({ id, name: 'test' }))
  }

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

  it('should create a new location', async () => {
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

  it('should return list of locations', async () => {
    const query: any = {
      name: 'test',
      type: 'Primary',
      skip: null
    }
    const req: any = {
      originalUrl: 'location?name=test&type=Primary'
    }

    const result = await controller.getMany(query, req)
    expect(mockLocationService.getMany).toHaveBeenCalledWith(
      {
        otherQuery: 'name=test&type=Primary',
        endpoint: 'locations',
        skip: null
      },
      {
        name: 'test',
        type: 'Primary'
      }
    )
    expect(result).toStrictEqual([
      { name: 'test', type: 'Primary' },
      { name: 'test', type: 'Primary' }
    ])
  })

  it('should return location with specified id', async () => {
    const id = 5

    const result = await controller.getOne(id)

    expect(mockLocationService.getOne).toHaveBeenCalledWith(5)
    expect(result).toStrictEqual({ id: 5, name: 'test' })
  })

  it('should update location with specified id', async () => {
    const id = 6
    const dto: any = {
      name: 'upd',
      type: 'upd'
    }
    const result = await controller.updateOne(id, dto)
    expect(mockLocationService.updateOne).toHaveBeenCalledWith(6, { name: 'upd', type: 'upd' })
    expect(result).toStrictEqual({ id: 6, name: 'upd', type: 'upd' })
  })

  it('should remove location with specified id', async () => {
    const id = 5
    const result = await controller.removeOne(id)
    expect(mockLocationService.removeOne).toHaveBeenCalledWith(5)
    expect(result).toStrictEqual({ id: 5, name: 'test' })
  })
})
