import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHalth(): string {
    return 'Im alive!';
  }
}
