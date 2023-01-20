import { ArgumentMetadata, HttpException, HttpStatus, PipeTransform, ValidationError } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'

export class BackendValidationPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    const object = plainToInstance(metatype, value)
    const errors = await validate(object)

    if (!errors.length) return value

    throw new HttpException({ errors: this.formatErrors(errors) }, HttpStatus.BAD_REQUEST)
  }

  private formatErrors(errors: ValidationError[]) {
    return errors.reduce((acc, err) => {
      acc[err.property] = Object.values(err.constraints)
      return acc
    }, {})
  }
}
