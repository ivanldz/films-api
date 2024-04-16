import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('health')
  getHealth(): string {
    return this.appService.getHalth();
  }

  @Get('seed')
  seedDB(): string {
    this.appService.seedDB();
    return "Seeding database in background"
  }
}
