import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { INTERVAL_HOST_KEY } from './decorators/interval-host.decorator';
import { INTERVAL_KEY } from './decorators/interval.decorator';

@Injectable()
export class IntervalScheduler
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private readonly intervalRefs: NodeJS.Timeout[] = [];
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
    private readonly metadataScanner: MetadataScanner,
  ) {}

  onApplicationBootstrap() {
    const providers = this.discoveryService.getProviders();
    providers.forEach((wrapper) => {
      const { instance } = wrapper;
      const prototype = instance && Object.getPrototypeOf(instance);
      if (!instance || !prototype) {
        // Will exclude value and factory providers, only interested in intastiated classes
        return;
      }
      const isIntervalHost = // Class with interval decorator
        this.reflector.get(INTERVAL_HOST_KEY, instance.constructor) ?? false;

      if (isIntervalHost) {
        console.log('IntervalHost found', wrapper.token);
      }

      const methodKeys = this.metadataScanner.getAllMethodNames(prototype);
      // Get all the method names of the classes marked with the class decorator
      methodKeys.forEach((methodKey) => {
        // Find which methods have the method decorator
        const interval = this.reflector.get(INTERVAL_KEY, instance[methodKey]);
        if (!interval) {
          return;
        }
        console.log('Interval found', wrapper.token, methodKey);
        // For the methods that have the method decorator, call on the interval
        const intervalRef = setInterval(() => instance[methodKey](), interval);
        this.intervalRefs.push(intervalRef);
      });
    });
  }

  onApplicationShutdown(signal?: string) {
    // Clean up on application shutdown
    console.log('cleaning up intervals at shutdown');
    this.intervalRefs.forEach((intervalId) => clearInterval(intervalId));
  }
}
