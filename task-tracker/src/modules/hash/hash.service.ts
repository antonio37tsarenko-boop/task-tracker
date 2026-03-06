import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  hash(password: string) {
    return bcrypt.hash(password, 10);
  }

  compare(data: string, hash: string) {
    return bcrypt.compare(data, hash);
  }
}
