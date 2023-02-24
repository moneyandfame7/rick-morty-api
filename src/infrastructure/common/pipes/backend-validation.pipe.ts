import { ArgumentMetadata, Injectable, PipeTransform, UnprocessableEntityException, ValidationError } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'

@Injectable()
export class CustomValidationPipe implements PipeTransform {
  public constructor() {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    const { metatype } = metadata
    if (!metatype || !this.toValidate(metatype)) {
      return value
    }
    const object = plainToInstance(metatype, value)
    const errors = await validate(object, { transform: false })

    if (errors.length > 0) {
      const errorBody = this.formatError(errors)
      throw new UnprocessableEntityException({ errors: errorBody })
    }

    return value
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object]
    return !types.includes(metatype)
  }

  private formatError(errors: ValidationError[]) {
    return errors.reduce((acc, err) => {
      if (err.constraints) {
        acc[err.property] = Object.values(err.constraints)
        return acc
      }
    }, {})
  }
}
