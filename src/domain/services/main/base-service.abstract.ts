import { Response } from '@services/common/pagination.service'
import { QueryPaginationDto } from '@dto/common/pagination.dto'

export abstract class BaseServiceAbstract<Entity, CreateEntityDto, UpdateEntityDto, QueryEntityDto> {
  public abstract createOne(dto: CreateEntityDto, file?: Express.Multer.File): Promise<Entity>

  public abstract getMany(queryPaginationDto: QueryPaginationDto, dto: QueryEntityDto): Promise<Response<Entity>>

  public abstract getOne(id: number): Promise<Entity>

  public abstract updateOne(id: number, dto: UpdateEntityDto): Promise<Entity>

  public abstract removeOne(id: number): Promise<Entity>

  public abstract getCount(): Promise<number>
}
