import type { Presenter } from '@app/services/common/pagination.service'
import type { QueryPaginationDto } from '@app/dto/common/pagination.dto'

export abstract class MainServiceAbstract<Entity, CreateEntityDto, UpdateEntityDto, QueryEntityDto> {
  public abstract createOne(dto: CreateEntityDto, file?: Express.Multer.File): Promise<Entity>

  public abstract getMany(queryPaginationDto: QueryPaginationDto, dto: QueryEntityDto): Promise<Presenter<Entity>>

  public abstract getOne(id: number): Promise<Entity>

  public abstract updateOne(id: number, dto: UpdateEntityDto): Promise<Entity>

  public abstract removeOne(id: number): Promise<Entity>

  public abstract getCount(): Promise<number>
}
