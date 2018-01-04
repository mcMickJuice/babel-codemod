import { sync as resolveSync } from 'resolve';
import Resolver from './Resolver';

export default class PackageResolver implements Resolver {
  async canResolve(source: string): Promise<boolean> {
    try {
      await this.resolve(source);
      return true;
    } catch {
      return false;
    }
  }

  async resolve(source: string): Promise<string> {
    return resolveSync(source, { basedir: process.cwd() });
  }
}
