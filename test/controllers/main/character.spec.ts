import { Test, TestingModule } from '@nestjs/testing'

import { CharacterController } from '@app/controllers/main'
import { CreateCharacterDto } from '@app/dto/main'
import { CharacterService } from '@app/services/main'

jest.mock('@common/decorators', () => ({
  ...jest.requireActual('@common/decorators'),
  ApiEntitiesOperation: () => jest.fn()
}))

describe('CharacterController', () => {
  let controller: CharacterController
  let counter = 0
  const mockCharacterService = {
    createOne: jest.fn(dto => ({
      id: ++counter,
      ...dto,
      createdAt: new Date()
    })),
    getMany: jest.fn(async (pagination, dto) => [
      {
        name: dto.name,
        status: dto.status
      },
      {
        name: dto.name,
        status: dto.status
      }
    ]),
    getOne: jest.fn(async id => ({
      id,
      name: 'morty'
    })),
    updateOne: jest.fn(async (id, dto) => ({
      id,
      ...dto
    })),
    removeOne: jest.fn(async id => ({ id }))
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CharacterController],
      providers: [
        {
          provide: CharacterService,
          useValue: mockCharacterService
        }
      ]
    }).compile()
    controller = module.get<CharacterController>(CharacterController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should create a character', () => {
    const dto: CreateCharacterDto = {
      name: 'fuck niggaaaa',
      status: 'Suka',
      type: 'pidor',
      gender: 'tej',
      species: 'ne eby'
    }
    const file: any = {}
    expect(controller.createOne(dto, file)).toStrictEqual({
      id: expect.any(Number),
      ...dto,
      createdAt: expect.any(Date)
    })
    expect(mockCharacterService.createOne).toBeCalledWith(dto, file)
  })

  describe('find all characters', () => {
    it('should return array of characters', () => {
      const query: any = {
        name: 'aboba',
        status: null,
        skip: null
      }
      const req: any = {
        originalUrl: 'characters?id=5'
      }
      controller.getMany(query, req)
      expect(mockCharacterService.getMany).toBeCalledWith(
        {
          otherQuery: 'id=5',
          endpoint: 'characters',
          skip: null
        },
        { name: 'aboba' }
      )
    })

    it('should returns array of characters async', async () => {
      const query: any = {
        name: 'Rick',
        take: 50,
        status: 'Alive'
      }

      const req: any = {
        originalUrl: 'characters?name=Rick'
      }
      const result = await controller.getMany(query, req)
      expect(mockCharacterService.getMany).toBeCalledWith(
        {
          otherQuery: 'name=Rick',
          endpoint: 'characters',
          take: 50
        },
        {
          name: 'Rick',
          status: 'Alive'
        }
      )
      expect(result).toStrictEqual([
        {
          name: query.name,
          status: query.status
        },
        {
          name: query.name,
          status: query.status
        }
      ])
    })
  })

  describe('get by specified id', () => {
    it('should return character', async () => {
      const id = 255

      const result = await controller.getOne(id)
      expect(result).toStrictEqual({
        id,
        name: 'morty'
      })
      expect(mockCharacterService.getOne).toHaveBeenCalledWith(id)
    })

    it('should return promise', async () => {
      const id = 255

      const result = controller.getOne(id)
      expect(mockCharacterService.getOne).toHaveBeenCalledWith(id)
      expect(result).toBeInstanceOf(Promise)
    })
  })

  it('should update a character', async () => {
    const dto = {
      name: 'fuck niggaaaa',
      status: 'Suka',
      type: 'pidor',
      gender: 'tej',
      species: 'ne eby'
    }
    const result = await controller.updateOne(1337, dto)
    expect(result).toStrictEqual({
      id: 1337,
      ...dto
    })
    expect(mockCharacterService.updateOne).toBeCalledWith(1337, dto)
  })

  it('should remove a character', async () => {
    const id = 5
    const result = await controller.removeOne(id)
    expect(result).toEqual({ id: 5 })
    expect(mockCharacterService.removeOne).toHaveBeenCalledWith(id)
  })
})
