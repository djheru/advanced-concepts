import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { IntervalScheduler } from './interval.scheduler';

@Module({
  providers: [IntervalScheduler],
  imports: [DiscoveryModule],
})
export class SchedulerModule {}
