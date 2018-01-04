import { get, Response } from 'got';
import { writeFile } from 'mz/fs';
import { tmpNameSync as tmp } from 'tmp';
import Resolver from './Resolver';

export class NetworkLoadError extends Error {
  constructor(
    readonly response: Response<string>,
  ) {
    super(`failed to load plugin from '${response.url}'`);
  }
}

export default class NetworkResolver implements Resolver {
  async canResolve(source: string): Promise<boolean> {
    try {
      return Boolean(new URL(source));
    } catch {
      return false;
    }
  }

  async resolve(source: string): Promise<string> {
    let response = await get(source, { followRedirect: true });

    if (response.statusCode !== 200) {
      throw new NetworkLoadError(response);
    }

    let filename = tmp();
    await writeFile(filename, response.body);
    return filename;
  }
}
