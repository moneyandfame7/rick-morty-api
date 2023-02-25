import { BadRequestException, Injectable } from '@nestjs/common'
import * as sharp from 'sharp'
import type { PutObjectCommandInput } from '@aws-sdk/client-s3'

import { RolesService, S3Service, TokenService } from '@app/services/common'
import { AddRoleDto, BanUserDto, CreateUserDto, UpdateUserDto } from '@app/dto/common'

import { UserRepository } from '@infrastructure/repositories/common'
import { User } from '@infrastructure/entities/common'

import { UserException } from '@common/exceptions/common'

@Injectable()
export class UserService {
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly rolesService: RolesService,
    private readonly tokenService: TokenService,
    private readonly s3Service: S3Service,
    private readonly userException: UserException
  ) {}

  public async createOne(dto: CreateUserDto): Promise<User> {
    const userWithSameEmail = await this.getOneByAuthType(dto.email, dto.auth_type)
    if (userWithSameEmail && userWithSameEmail.auth_type === 'jwt') {
      throw this.userException.alreadyExistsWithEmail(dto.email)
    }

    const user = await this.userRepository.createOne(dto)
    user.role = await this.rolesService.getOne('user')
    return this.userRepository.save(user)
  }

  public async getMany(): Promise<User[]> {
    const users = await this.userRepository.getMany()

    if (!users.length) {
      throw this.userException.manyNotFound()
    }

    return users
  }

  public async getOneById(id: string): Promise<User> {
    const user = await this.userRepository.getOneById(id)

    if (!user) {
      throw this.userException.withIdNotFound(id)
    }

    return user
  }

  public async getOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.getOneByEmail(email)
  }

  public async getOneByAuthType(email: string, authType: string): Promise<User | null> {
    return this.userRepository.getOneByAuthType(email, authType)
  }

  public async getOneByUsername(username: string): Promise<User | null> {
    return this.userRepository.getOneByUsername(username)
  }

  public async getOneByVerifyLink(link: string): Promise<User> {
    const user = await this.userRepository.getOneByVerifyLink(link)
    if (!user) {
      throw this.userException.notFound()
    }

    return user
  }

  public async updateOne(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.getOneById(id)

    if (!user) {
      throw this.userException.withIdNotFound(id)
    }

    return this.userRepository.updateOne(id, updateUserDto)
  }

  public async changeUsername(id: string, username: string): Promise<User> {
    const user = await this.userRepository.getOneByUsername(username)
    if (user) {
      throw this.userException.alreadyExistsWithUsername(username)
    }

    return this.updateOne(id, { username })
  }

  public async save(user: User): Promise<User> {
    return this.userRepository.save(user)
  }

  public async changePhoto(id: string, file: Express.Multer.File): Promise<User> {
    if (!file) throw new BadRequestException('You must provide a photo')
    const fileBuffer = await sharp(file.buffer).resize({ height: 128, width: 128, fit: 'cover' }).toBuffer()
    const [, type] = file.mimetype.split('/')
    const params: PutObjectCommandInput = {
      Bucket: this.s3Service.bucketName,
      Key: `users/${id}.${type}`,
      Body: fileBuffer,
      ContentType: file.mimetype,
      ACL: 'public-read'
    }
    const user = await this.getOneById(id)
    user.photo = await this.s3Service.upload(params)

    return this.userRepository.save(user)
  }

  public async removeOne(id: string): Promise<User> {
    const user = await this.userRepository.getOneById(id)

    if (!user) {
      throw this.userException.withIdNotFound(id)
    }

    await this.tokenService.removeByUserId(user.id)
    return this.userRepository.removeOne(id)
  }

  public async addRole(dto: AddRoleDto): Promise<User> {
    const user = await this.userRepository.getOneById(dto.userId)
    const role = await this.rolesService.getOne(dto.value)

    if (user && role) {
      user.role = role
      return this.userRepository.save(user)
    }
    throw new BadRequestException('Role or user not found.')
  }

  public async ban(dto: BanUserDto): Promise<User> {
    const user = await this.userRepository.getOneById(dto.userId)
    if (!user) {
      throw this.userException.withIdNotFound(dto.userId)
    }

    return this.userRepository.ban(dto.userId, dto.banReason)
  }

  public async emailExists(email: string): Promise<boolean> {
    const user = await this.userRepository.getOneByEmail(email)

    return !!user
  }

  public async getCount(): Promise<number> {
    return this.userRepository.getCount()
  }
}
