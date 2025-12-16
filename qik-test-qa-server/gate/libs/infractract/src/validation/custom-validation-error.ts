export class CustomValidationError {
  message: string;

  constructor(e: CustomValidationError) {
    this.message = e.message;
  }
}
