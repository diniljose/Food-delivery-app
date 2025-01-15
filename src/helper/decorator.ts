import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';



export function IsDateFormat(format: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isDateFormat',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          // Regular expression for yyyy-mm-dd format
          const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
          return typeof value === 'string' && dateRegex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be in yyyy-mm-dd format`;
        },
      },
    });
  };
}



export function IsFileSizeValid(maxSize: number, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isFileSizeValid',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!Array.isArray(value)) return false;

          return value.every(file => {
            // Check if the file data exists and is less than or equal to maxSize
            return file.data && file.data.length <= maxSize; // Use buffer length
          });
        },
        defaultMessage(args: ValidationArguments) {
          return `Each file must be less than or equal to ${maxSize / (1024 * 1024)} MB`;
        },
      },
    });
  };
}
