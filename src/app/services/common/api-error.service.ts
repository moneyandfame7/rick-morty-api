import { HttpException, HttpStatus, Injectable } from '@nestjs/common'

@Injectable()
export class ApiErrorService {
  // function errorApi() {
  //   const errorResponse = {
  //     errors: {}
  //   }
  //   return {
  //     buildErrorResponse(key, error) {
  //       errorResponse.errors[key] = error
  //     },
  //     getErrorResponse() {
  //       return errorResponse
  //     }
  //   }
  // }
  //
  // const error = errorApi()
  // error.buildErrorResponse('pavapepe', 'gemabodyjosanave')
  // error.buildErrorResponse('123', '12341234')
  // error.buildErrorResponse('4568578', '6789678967896789')
  // console.log(error.getErrorResponse())

  public throwErrorResponse(key: string, error: string, status: HttpStatus): HttpException {
    const errorResponse = {
      errors: {}
    }
    errorResponse.errors[key] = error
    return new HttpException(errorResponse, status)
  }
}
