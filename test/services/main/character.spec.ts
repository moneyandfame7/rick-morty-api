import 'dotenv/config'
import { ConflictException, NotFoundException, UnprocessableEntityException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'

import { CharacterService } from '@app/services/main'
import { PaginationService, S3Service } from '@app/services/common'
import { QueryPaginationDto } from '@infrastructure/dto/common'
import { CreateCharacterDto, UpdateCharacterDto } from '@infrastructure/dto/main'

import { CharacterRepository } from '@infrastructure/repositories/main'

import { CharacterException } from '@common/exceptions/main'

import { MOCK_CHARACTER_COUNT, mockCharacterException, mockCharacterRepository, mockCreateCharacterDto, mockExistCharacter } from '../../utils/mock/main/character.mock'
import { mockExpressFile, mockPaginationService, mockS3Service, mockSharp } from '../../utils/mock/common'

jest.mock('sharp', () => () => mockSharp)

describe('[Character] Service', () => {
  let service: CharacterService
  beforeEach(async () => {
    mockCharacterRepository.findOneBy = jest.fn()
    mockCharacterRepository.getOne = jest.fn()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CharacterService,
        { provide: CharacterRepository, useValue: mockCharacterRepository },
        { provide: S3Service, useValue: mockS3Service },
        { provide: PaginationService, useValue: mockPaginationService },
        { provide: CharacterException, useValue: mockCharacterException }
      ]
    }).compile()

    service = module.get<CharacterService>(CharacterService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('[CREATE]', () => {
    it('should throw an error if the file is not provided', async () => {
      let file: any = null
      let result: any
      try {
        result = await service.createOne(mockCreateCharacterDto, file)
      } catch (e) {
        expect(result).toBeUndefined()
        expect(mockCharacterException.emptyFile).toHaveBeenCalled()
        expect(e).toBeInstanceOf(UnprocessableEntityException)
        expect(e.response).toHaveProperty('message', 'Empty file')
      }
    })

    it('should throw an error if the character already exists', async () => {
      mockCharacterRepository.findOneBy = jest.fn().mockResolvedValue(mockExistCharacter)
      let result: any
      try {
        result = await service.createOne(mockExistCharacter, mockExpressFile)
      } catch (e) {
        expect(result).toBeUndefined()
        expect(mockCharacterException.alreadyExists).toBeCalled()
        expect(e).toBeInstanceOf(ConflictException)
        expect(e.response).toHaveProperty('message', 'Already exists')
      }
    })

    it('should successfully create a character and upload image', async () => {
      const result = await service.createOne(mockCreateCharacterDto, mockExpressFile)
      const [, type] = mockExpressFile.mimetype.split('/')

      // todo: можливо визивати тут mockCharacterService.getCount?? check character service
      const charAttributes: CreateCharacterDto = {
        id: MOCK_CHARACTER_COUNT + 1,
        name: mockCreateCharacterDto.name,
        type: mockCreateCharacterDto.type,
        status: mockCreateCharacterDto.status,
        gender: mockCreateCharacterDto.gender,
        species: mockCreateCharacterDto.species
      }
      charAttributes.image = `${process.env.S3BUCKET_URL}/characters/${charAttributes.id}.${type}`

      expect(mockSharp.resize).toBeCalled()
      expect(mockS3Service.upload).toBeCalledWith({
        Bucket: process.env.S3BUCKET_URL,
        Key: `characters/${MOCK_CHARACTER_COUNT + 1}.${type}`,
        Body: expect.any(Buffer),
        ContentType: 'image/jpeg',
        ACL: 'public-read'
      })
      expect(mockCharacterRepository.createOne).toBeCalledWith(charAttributes)
      expect(result).toStrictEqual({
        id: expect.any(Number),
        ...mockCreateCharacterDto,
        image: `${process.env.S3BUCKET_URL}/characters/${MOCK_CHARACTER_COUNT + 1}.${type}`,
        createdAt: expect.any(Date)
      })
    })
  })

  describe('[GET MANY]', () => {
    const queryPaginationDto = new QueryPaginationDto()
    queryPaginationDto.otherQuery = 'name=rick&id=5'
    queryPaginationDto.endpoint = 'characters'
    const queryCharacterDto: any = { name: 'rick', id: 5 }
    it('should throw an error if the characters is not found', async () => {
      mockCharacterRepository.getMany = jest.fn().mockResolvedValue({ characters: [], count: 0 })

      let result: any
      try {
        result = await service.getMany(queryPaginationDto, queryCharacterDto)
      } catch (e) {
        expect(result).toBeUndefined()
        expect(mockCharacterException.manyNotFound).toHaveBeenCalled()
        expect(e).toBeInstanceOf(NotFoundException)
        expect(e.response).toHaveProperty('message', 'Many not found')
      }
    })

    it('should successfully return characters with page info', async () => {
      mockCharacterRepository.getMany = jest.fn().mockResolvedValue({
        characters: expect.any(Array),
        count: expect.any(Number)
      })

      const result = await service.getMany(queryPaginationDto, queryCharacterDto)

      expect(result).toStrictEqual({
        results: [{ id: expect.any(Number), name: 'rick' }],
        info: {
          page: 1,
          count: expect.any(Number),
          endpoint: 'characters',
          order: 'ASC',
          otherQuery: 'name=rick&id=5',
          take: 20
        }
      })
      expect(mockPaginationService.buildPaginationInfo).toHaveBeenCalledWith({
        queryPaginationDto,
        count: expect.any(Number)
      })
      expect(mockPaginationService.wrapEntityWithPaginationInfo).toHaveBeenCalledWith(result.results, result.info)
    })
  })

  describe('[GET ONE] with id: 1', () => {
    const id = 1
    it('should throw an error if the character is not found', async () => {
      mockCharacterRepository.getOne = jest.fn()
      let result: any
      try {
        result = await service.getOne(id)
      } catch (e) {
        expect(result).toBeUndefined()
        expect(mockCharacterException.withIdNotFound).toBeCalledWith(id)
        expect(e).toBeInstanceOf(NotFoundException)
        expect(e.response).toHaveProperty('message', `With id ${id} not found`)
      }
    })

    it('should successfully return the character', async () => {
      mockCharacterRepository.getOne = jest.fn().mockReturnValue({ id, name: 'test' })
      const result = await service.getOne(id)
      expect(result).toBeDefined()

      expect(result).toStrictEqual({
        id,
        name: 'test'
      })
      expect(mockCharacterRepository.getOne).toHaveBeenCalledWith(id)
    })
  })

  describe('[UPDATE] with id: 5', () => {
    const id = 5
    const dto: UpdateCharacterDto = {
      name: 'new test'
    }
    it('should throws an error if the character is not found', async () => {
      let result: any
      mockCharacterRepository.getOne = jest.fn().mockResolvedValue(null)
      try {
        result = await service.updateOne(id, dto)
      } catch (e) {
        expect(result).toBeUndefined()
        expect(mockCharacterException.withIdNotFound).toHaveBeenCalledWith(id)
        expect(e).toBeInstanceOf(NotFoundException)
        expect(e.response).toHaveProperty('message', `With id ${id} not found`)
      }
    })

    it('should successfully update the character', async () => {
      mockCharacterRepository.getOne = jest.fn(id => ({ id, name: 'test' }))
      let result: any
      result = await service.updateOne(id, dto)

      expect(mockCharacterRepository.getOne).toBeCalledWith(5)
      expect(result).toStrictEqual({ id, ...dto })
    })
  })

  describe('[REMOVE] with id: 7', () => {
    const id = 7

    it('should throws an error if the character not found', async () => {
      let result: any
      mockCharacterRepository.getOne = jest.fn().mockResolvedValue(null)
      try {
        result = await service.removeOne(id)
      } catch (e) {
        expect(result).toBeUndefined()
        expect(e).toBeInstanceOf(NotFoundException)
        expect(mockCharacterException.withIdNotFound).toBeCalledWith(id)
        expect(e.response).toHaveProperty('message', `With id ${id} not found`)
      }
    })

    it('should successfully remove the character', async () => {
      mockCharacterRepository.getOne = jest.fn(id => ({
        id,
        name: 'test'
      }))

      const result = await service.removeOne(id)
      expect(mockCharacterRepository.getOne).toHaveBeenCalledWith(id)
      expect(result).toStrictEqual({
        id,
        name: 'test'
      })
      expect(mockCharacterRepository.removeOne).toHaveBeenCalledWith(id)
    })
  })
})
