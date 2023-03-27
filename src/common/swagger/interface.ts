import {CustomDecorator, HttpStatus, Type} from '@nestjs/common'

export interface BaseOperationOptions {
    role?: CustomDecorator
    guard: MethodDecorator & ClassDecorator
    method: MethodDecorator
    summary: string
    status: HttpStatus
    type: Type<unknown> | Function | [Function] | string
}

export interface BaseOperations {
    CREATE: BaseOperationOptions
    GET_MANY: BaseOperationOptions
    GET_ONE: BaseOperationOptions
    UPDATE: BaseOperationOptions
    REMOVE: BaseOperationOptions
}

interface OtherOperations {
    GET_NAMES: BaseOperationOptions
    GET_BY_FIELDS: BaseOperationOptions
}

export type MainEntitiesOperations = BaseOperations & OtherOperations