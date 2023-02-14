import { BadRequestException, Injectable } from '@nestjs/common'
import { AddRoleDto, BanUserDto, CreateUserDto, UpdateUserDto } from '../../dto/common/user.dto'
import { UserRepository } from '../../repositories/common/user.repository'
import { RolesService } from './roles.service'
import { TokenService } from './token.service'
import {
  UsersNotFoundException,
  UserWithEmailAlreadyExistsException,
  UserWithIdNotFoundException,
  UserWithUsernameAlreadyExistsException
} from 'src/domain/exceptions/common/user.exception'
import * as sharp from 'sharp'
import { PutObjectCommandInput } from '@aws-sdk/client-s3'
import { S3Service } from './s3.service'

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly rolesService: RolesService,
    private readonly tokenService: TokenService,
    private readonly s3Service: S3Service
  ) {}

  async createOne(dto: CreateUserDto) {
    const userWithSameEmail = await this.getOneByEmail(dto.email)

    if (userWithSameEmail && userWithSameEmail.authType === 'jwt') throw new UserWithEmailAlreadyExistsException(dto.email)

    const user = await this.userRepository.createOne(dto)
    user.role = await this.rolesService.getRole('user')
    return await this.userRepository.save(user)
  }

  async getOneById(id: string) {
    const user = await this.userRepository.getOneById(id)

    if (!user) throw new UserWithIdNotFoundException(id)

    return user
  }

  async getOneByEmail(email: string) {
    const user = await this.userRepository.getOneByEmail(email)

    return user ? user : null
  }

  async getOneByAuthType(email: string, authType: string) {
    const user = await this.userRepository.getOneByAuthType(email, authType)

    return user ? user : null
  }

  async getOneByUsername(username: string) {
    const user = await this.userRepository.getOneByUsername(username)

    return user ? user : null
  }

  async getMany() {
    const users = await this.userRepository.getMany()

    if (!users.length) throw new UsersNotFoundException()

    return users
  }

  async getCount() {
    return await this.userRepository.getCount()
  }

  async updateOne(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.getOneById(id)

    if (!user) throw new UserWithIdNotFoundException(id)

    return await this.userRepository.updateOne(id, updateUserDto)
  }

  async changeUsername(id: string, username: string) {
    const user = await this.userRepository.getOneByUsername(username)
    if (user) throw new UserWithUsernameAlreadyExistsException(username)

    return await this.updateOne(id, { username })
  }

  async changePhoto(id: string, file: Express.Multer.File) {
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

    return await this.userRepository.save(user)
  }

  async removeOne(id: string) {
    const user = await this.userRepository.getOneById(id)
    await this.tokenService.removeByUserId(user.id)
    if (!user) throw new UserWithIdNotFoundException(id)

    return await this.userRepository.removeOne(id)
  }

  async addRole(dto: AddRoleDto) {
    const user = await this.userRepository.getOneById(dto.userId)
    const role = await this.rolesService.getRole(dto.value)

    if (user && role) {
      user.role = role
      return await this.userRepository.save(user)
    }
    throw new BadRequestException('Role or user not found.')
  }

  async ban(dto: BanUserDto) {
    const user = await this.userRepository.getOneById(dto.userId)
    if (!user) throw new UserWithIdNotFoundException(dto.userId)

    return await this.userRepository.ban(dto.userId, dto.banReason)
  }

  public async emailExists(email: string) {
    const user = await this.userRepository.getOneByEmail(email)

    return !!user
  }
}
