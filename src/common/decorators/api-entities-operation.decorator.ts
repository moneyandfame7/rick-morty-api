import { applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

import { BaseOperationOptions } from '@common/swagger'

// eslint-disable-next-line
export const ApiEntitiesOperation = ({ guard, role, method, summary, status, type }: BaseOperationOptions): any => {
  if (role) {
    return applyDecorators(method, guard, role, ApiOperation({ summary }), ApiResponse({ status, type }))
  }
  return applyDecorators(method, guard, ApiOperation({ summary }), ApiResponse({ status, type }))
}
