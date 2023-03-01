import { Test, TestingModule } from '@nestjs/testing'

import { CharacterController } from '@app/controllers/main'
import { CharacterService } from '@app/services/main'
import { QueryCharacterDto, UpdateCharacterDto } from '@app/dto/main'

import { ORDER } from '@common/constants'

import { mockExpressFile } from '../../utils/mock/common'
import { mockCharacterService, mockCreateCharacterDto } from '../../utils/mock/main/character.mock'

jest.mock('@common/decorators', () => ({
  ...jest.requireActual('@common/decorators'),
  ApiEntitiesOperation: () => jest.fn()
}))

describe('[Character] Controller', () => {
  let controller: CharacterController
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

  it('should return a promise', async () => {
    const id = 255

    const result = controller.getOne(id)
    expect(mockCharacterService.getOne).toHaveBeenCalledWith(id)
    expect(result).toBeInstanceOf(Promise)
  })

  it('[CREATE] - should return a created character', async () => {
    expect(await controller.createOne(mockCreateCharacterDto, mockExpressFile)).toStrictEqual({
      id: expect.any(Number),
      ...mockCreateCharacterDto,
      createdAt: expect.any(Date)
    })
    expect(mockCharacterService.createOne).toBeCalledWith(mockCreateCharacterDto, mockExpressFile)
  })

  it('[GET MANY] - should return page info and results [array of characters]', async () => {
    const query = new QueryCharacterDto()
    query.name = 'Morty'
    query.status = 'Dead'
    query.take = 70
    query.order = ORDER.DESC
    const req: any = {
      originalUrl: 'characters?name=Morty&status=Alive'
    }

    const result = await controller.getMany(query, req)

    expect(mockCharacterService.getMany).toBeCalledWith(
      {
        order: ORDER.DESC,
        otherQuery: 'name=Morty&status=Alive',
        endpoint: 'characters',
        page: 1,
        skip: 0,
        take: 70
      },
      {
        name: 'Morty',
        status: 'Dead'
      }
    )
    expect(result.results).toBeInstanceOf(Array)
    expect(result.info).toBeInstanceOf(Object)
  })

  it('[GET ONE] - should return a character with id: 255', async () => {
    const id = 255
    mockCharacterService.getOne = jest.fn().mockResolvedValue({ id, name: 'Morty-test' })

    const result = await controller.getOne(id)

    expect(mockCharacterService.getOne).toHaveBeenCalledWith(id)
    expect(result).toHaveProperty('id', 255)
  })

  it('[UPDATE] - should return updated character with id: 1337', async () => {
    const id = 1337
    const updateCharacterDto: UpdateCharacterDto = {
      name: 'Update character name'
    }

    const result = await controller.updateOne(id, updateCharacterDto)

    expect(mockCharacterService.updateOne).toBeCalledWith(id, updateCharacterDto)
    expect(result).toStrictEqual({ id: 1337, name: 'Update character name' })
  })

  it('[REMOVE] - should return a removed character with id: 5', async () => {
    const id = 5

    const result = await controller.removeOne(id)

    expect(mockCharacterService.removeOne).toHaveBeenCalledWith(id)
    expect(result).toHaveProperty('id', 5)
  })
})
