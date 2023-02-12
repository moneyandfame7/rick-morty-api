import { DataSource, Repository, SelectQueryBuilder } from 'typeorm'
import { QueryPaginationDto } from '../../infrastructure/dto/common/pagination.dto'

export abstract class BaseRepository<Entity, QueryEntityDto, CreateEntityDto, UpdateEntityDto, GetManyEntities> extends Repository<Entity> {
  protected constructor(protected dataSource: DataSource, protected alias: string, protected Entity: any) {
    super(Entity, dataSource.createEntityManager())
  }

  protected get builder() {
    return this.createQueryBuilder(this.alias)
  }

  protected abstract buildQueries(builder: SelectQueryBuilder<Entity>, queries: QueryEntityDto): void

  protected abstract buildRelations(builder: SelectQueryBuilder<Entity>): void

  abstract createOne(dto: CreateEntityDto): Promise<Entity>

  abstract getMany(queryPaginationDto: QueryPaginationDto, queryEntityDto: QueryEntityDto): Promise<GetManyEntities>

  abstract getOne(id: number): Promise<Entity>

  abstract updateOne(id: number, dto: UpdateEntityDto): Promise<Entity>

  abstract removeOne(id: number): Promise<Entity>

  public async getCount(): Promise<number> {
    const queryBuilder = this.builder

    return queryBuilder.getCount()
  }
}
