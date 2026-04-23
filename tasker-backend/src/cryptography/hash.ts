export interface Hash {
  generator(plain: string) : Promise<string>;
  compare(plain: string, hash: string) : Promise<boolean>;
}