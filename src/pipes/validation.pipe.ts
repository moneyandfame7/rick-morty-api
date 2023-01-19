import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform, ValidationError } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'

@Injectable()
// for all other entity
export class BackendValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    const object = plainToInstance(metadata.metatype, value)
    const errors = await validate(object)
    if (!errors.length) return value

    throw new HttpException({ errors: this.formatError(errors) }, HttpStatus.BAD_REQUEST)
  }

  formatError(errors: ValidationError[]) {
    return errors.reduce((acc, err) => {
      acc[err.property] = Object.values(err.constraints)
      return acc
    }, {})
  }
}
