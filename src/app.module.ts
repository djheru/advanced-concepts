import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';
import { SchedulerModule } from './scheduler/scheduler.module';

@Module({
  imports: [CoffeesModule, SchedulerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
