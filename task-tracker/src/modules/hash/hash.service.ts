import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';

@Injectable()
export class HashService {
  hash(password: string) {
    return hash(password, 10);
  }

  compare(data: string, hash: string) {
    return compare(data, hash);
  }
}
