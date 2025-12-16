import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService extends ConsoleLogger {
  d(logTag: string, message: string, values?: object) {
    super.debug(this.formMessage(logTag, message), values);
  }
  l(logTag: string, message: string, values?: object) {
    super.log(this.formMessage(logTag, message), values);
  }
  w(logTag: string, message: string, values?: object) {
    super.warn(this.formMessage(logTag, message), values);
  }
  e(logTag: string, message: string, values?: object) {
    super.warn(this.formMessage(logTag, message), values);
  }
  f(logTag: string, message: string, values?: object) {
    super.fatal(this.formMessage(logTag, message), values);
  }

  private formMessage(logTag: string, message: string): string {
    return logTag + ' ' + message;
  }
}
