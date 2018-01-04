import { readFile, writeFile } from 'mz/fs';
import NetworkResolver from './NetworkResolver';

export default class AstExplorerLoader extends NetworkResolver {
  async canResolve(source: string): Promise<boolean> {
    if (await super.canResolve(source)) {
      let url = new URL(source);

      // https://astexplorer.net/api/v1/gist/68827467161b95ee48048ff906fab6d8/5ece951309157948661ae732af89209715bfe532
      return (
        url.hostname === 'astexplorer.net' &&
        /^\/api\/v1\/gist\/[a-f0-9]+(\/[a-f0-9]+)?$/.test(url.pathname)
      );
    }

    return false;
  }

  async resolve(source: string): Promise<string> {
    let filename = await super.resolve(source);
    let data = JSON.parse(await readFile(filename, { encoding: 'utf8' }));

    await writeFile(filename, data.files['transform.js']);

    return filename;
  }
}
