import * as process from 'node:process';
import * as path from 'path';

import { config } from 'dotenv';
config();

import { Data } from '../data';

export class EnvPathFactory {
  private static readonly BASE_DIR = path.resolve(process.cwd(), '.');

  private static env() {
    return process.env.ENVIRONMENT || 'local';
  }

  static createScopePath(scope: Data.Scope): string {
    return path.resolve(
      this.BASE_DIR,
      'envs',
      this.env(),
      'scopes',
      `${scope}.env`,
    );
  }

  static createServicePath(service: Data.Service): string {
    return path.resolve(
      this.BASE_DIR,
      'envs',
      this.env(),
      'services',
      `${service}.env`,
    );
  }

  static create(scopes: Data.Scope[], service?: Data.Service): string[] {
    const paths = scopes.map((s) => this.createScopePath(s));
    if (service) {
      paths.push(this.createServicePath(service));
    }
    return paths;
  }
}
