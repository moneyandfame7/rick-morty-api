import { QueryPaginationDto } from '@app/dto/common'
import type { Presenter } from '@core/services/common'

export interface BaseService<Entity, CreateEntityDto, UpdateEntityDto, QueryEntityDto> {
  createOne(dto: CreateEntityDto, file?: Express.Multer.File): Promise<Entity>

  getMany(queryPaginationDto: QueryPaginationDto, dto: QueryEntityDto): Promise<Presenter<Entity>>

  getOne(id: number): Promise<Entity>

  updateOne(id: number, dto: UpdateEntityDto): Promise<Entity>

  removeOne(id: number): Promise<Entity>

  getCount(): Promise<number>
}
