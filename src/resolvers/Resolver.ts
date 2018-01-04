export default interface Resolver {
  canResolve(source: string): Promise<boolean>;
  resolve(source: string): Promise<string>;
}
