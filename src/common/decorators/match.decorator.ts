import { ClassConstructor } from 'class-transformer'
import { ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from 'class-validator'

export const Match = <T>(type: ClassConstructor<T>, property: (o: T) => any, validationOptions?: ValidationOptions): ((obj: any, prop: string) => void) => {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: MatchConstraint
    })
  }
}

@ValidatorConstraint({ name: 'Match' })
export class MatchConstraint implements ValidatorConstraintInterface {
  public validate(value: any, args: ValidationArguments): boolean {
    const [fn] = args.constraints
    return fn(args.object) === value
  }

  public defaultMessage(args: ValidationArguments): string {
    const [constraintProperty]: (() => any)[] = args.constraints
    return `${constraintProperty} and ${args.property} does not match`
  }
}
