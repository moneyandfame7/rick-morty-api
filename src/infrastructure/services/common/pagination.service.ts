import { Injectable } from '@nestjs/common'
import type { QueryPaginationDto } from '@dto/common/pagination.dto'
import { EnvironmentConfigService } from '@config/environment-config.service'
import { PageDoesNotExistException } from '@domain/exceptions/common/pagination.exception'

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

export interface Payload<Entity> {
  info: BuildPaginationOptions
  results: Entity[]
}

@Injectable()
export class PaginationService<Entity> {
  constructor(private readonly config: EnvironmentConfigService) {}

  private queryString(query: string | undefined, current: number, page: number, endpoint: string): string | null {
    if (query?.includes('page')) {
      return this.config.getBaseUrl() + '/api/' + query.replace(`page=${current}`, `page=${page}`)
    }

    return query ? this.config.getBaseUrl() + '/api/' + endpoint + `?page=${page}` + query.replace(endpoint + '?', '&') : null
  }

  public buildPaginationInfo({ queryPaginationDto, count }: PaginationOptions): BuildPaginationOptions {
    const page = queryPaginationDto.page
    const pages = Math.ceil(count / queryPaginationDto?.take)
    const endpoint = queryPaginationDto.endpoint
    const otherQuery = queryPaginationDto.otherQuery
    const take = queryPaginationDto.take
    if (page > pages) throw new PageDoesNotExistException(page)
    return {
      page,
      take,
      count,
      pages,
      prev: page - 1 ? this.queryString(otherQuery, page, page - 1, endpoint) : null,
      next: page < pages ? this.queryString(otherQuery, page, page + 1, endpoint) : null
    }
  }

  public wrapEntityWithPaginationInfo(results: Entity[], info: BuildPaginationOptions): Payload<Entity> {
    return {
      info,
      results
    }
  }
}
