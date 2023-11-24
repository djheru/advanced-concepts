import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { INTERVAL_HOST_KEY } from './decorators/interval-host.decorator';

@Injectable()
export class IntervalScheduler implements OnApplicationBootstrap {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
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
    });
  }
}
