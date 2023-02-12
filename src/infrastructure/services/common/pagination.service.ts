import { Injectable } from '@nestjs/common'
import { QueryPaginationDto } from '../../dto/common/pagination.dto'
import { EnvironmentConfigService } from '../../config/environment-config.service'
import { PageDoesNotExistException } from 'src/domain/exceptions/common/pagination.exception'

export interface PaginationOptions {
  queryPaginationDto: QueryPaginationDto
  count: number
}

export interface BuildPaginationOptions {
  page: number
  take: number
  count: number
  pages: number
  prev: string
  next: string
}

export interface Payload<Entity> {
  info: BuildPaginationOptions
  results: Array<Entity>
}

@Injectable()
export class PaginationService<Entity> {
  constructor(private readonly config: EnvironmentConfigService) {}

  private queryString(query: string, current: number, page: number, endpoint: string) {
    return query.includes('page')
      ? this.config.getBaseUrl() + '/api/' + query.replace(`page=${current}`, `page=${page}`)
      : this.config.getBaseUrl() + '/api/' + endpoint + `?page=${page}`
  }

  public buildPaginationInfo({ queryPaginationDto, count }: PaginationOptions): BuildPaginationOptions {
    const page = queryPaginationDto.page
    const pages = Math.ceil(count / queryPaginationDto.take)
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

  public wrapEntityWithPaginationInfo(results: Array<Entity>, info: BuildPaginationOptions): Payload<Entity> {
    return {
      info,
      results
    }
  }
}
