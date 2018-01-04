import { stat } from 'mz/fs';
import Resolver from './Resolver';

const DEFAULT_PLUGIN_EXTENSIONS = new Set(['.js']);

export default class FileSystemResolver implements Resolver {
  constructor(
    private readonly optionalExtensions: Set<string> = DEFAULT_PLUGIN_EXTENSIONS,
  ) {}

  private *enumerateCandidateSources(source: string): IterableIterator<string> {
    yield source;

    for (let ext of this.optionalExtensions) {
      if (ext[0] !== '.') {
        yield `${source}.${ext}`;
      } else {
        yield source + ext;
      }
    }
  }

  async canResolve(source: string): Promise<boolean> {
    for (let candidate of this.enumerateCandidateSources(source)) {
      if ((await stat(candidate)).isFile()) {
        return true;
      }
    }

    return false;
  }

  async resolve(source: string): Promise<string> {
    for (let candidate of this.enumerateCandidateSources(source)) {
      if ((await stat(candidate)).isFile()) {
        return candidate;
      }
    }

    throw new Error(`unable to resolve file from source: ${source}`);
  }
}
