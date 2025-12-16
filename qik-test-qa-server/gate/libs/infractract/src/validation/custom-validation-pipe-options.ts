import { ValidationPipeOptions as IValidationPipeOptions } from '@nestjs/common';
import { ValidationError as ClassValidatorValidationError } from 'class-validator';

import { CustomValidationError } from './custom-validation-error';

export class ValidationPipeOptions implements IValidationPipeOptions {
  transform = true;
  whitelist: true;
  forbidNonWhitelisted: true;

  constructor() {
    this.exceptionFactory = this.exceptionFactory.bind(this);
  }

  exceptionFactory(errors: ClassValidatorValidationError[]) {
    const message = ValidationPipeOptions.handleErrorsArray(errors);
    return new CustomValidationError({ message });
  }
}

export namespace ValidationPipeOptions {
  export const handleSingleError = (e: ClassValidatorValidationError): string | null => {
    if (e.constraints) return Object.values(e.constraints).join('; ');
    if (e.children) return e.children.map(handleSingleError).join('; ');
    return null;
  };

  export const handleErrorsArray = (errors: ClassValidatorValidationError[]): string =>
    errors.map(handleSingleError).filter(Boolean).join('; ');
}
