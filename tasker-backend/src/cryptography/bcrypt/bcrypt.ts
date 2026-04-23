import { Hash } from "../hash";
import {hash, compare} from 'bcrypt';

export class BcryptHash implements Hash {
  async generator(plain: string) {
    return hash(plain, 10);
  }
  async compare(plain: string, hash: string) {
    return compare(plain, hash);
  }
}