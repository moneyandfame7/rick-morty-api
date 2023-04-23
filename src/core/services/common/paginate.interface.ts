import { QueryPaginationDto } from '@infrastructure/dto/common'

export interface PaginationOptions {
  queryPaginationDto: QueryPaginationDto
  count: number
}

export interface BuildPaginationOptions {
  page: number
  take: number
  count: number
  pages: number
  prev: string | null
  next: string | null
}

export interface Presenter<Entity> {
  info: BuildPaginationOptions
  results: Entity[]
}
