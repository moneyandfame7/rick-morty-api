import { Delete, Get, Patch, Post } from '@nestjs/common'

export const HttpMethod = {
  POST: (route: string): MethodDecorator => Post(route),
  GET: (route: string): MethodDecorator => Get(route),
  PATCH: (route: string): MethodDecorator => Patch(route),
  DELETE: (route: string): MethodDecorator => Delete(route)
}
