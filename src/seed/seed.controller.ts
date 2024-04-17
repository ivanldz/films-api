import { Controller, Get } from '@nestjs/common';
import { SeedResponse } from './interfaces/response.interfaces';
import { SeedService } from './seed.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Seed")
@Controller('seed')
export class SeedController {
    constructor(private readonly seedService: SeedService) { }

    @Get('')
    seedDb(): Promise<SeedResponse> {
        return this.seedService.seedDB()
    }
}
