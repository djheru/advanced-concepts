import { Module } from '@nestjs/common';
import { CoffeesController } from './coffees.controller';
import { COFFEES_DATA_SOURCE } from './coffees.datasource';
import { CoffeesService } from './coffees.service';

@Module({
  controllers: [CoffeesController],
  providers: [
    CoffeesService,
    {
      provide: COFFEES_DATA_SOURCE,
      useValue: [],
    },
  ],
})
export class CoffeesModule {}
