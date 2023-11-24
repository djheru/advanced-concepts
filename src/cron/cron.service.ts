import { IntervalHost } from 'src/scheduler/decorators/interval-host.decorator';
import { Interval } from 'src/scheduler/decorators/interval.decorator';

@IntervalHost
export class CronService {
  @Interval(1000)
  everySecond() {
    console.log('Every second this will run');
  }
}
