import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';

@Injectable()
export class IntervalScheduler implements OnApplicationBootstrap {
  constructor(private readonly discoveryService: DiscoveryService) {}

  onApplicationBootstrap() {
    const providers = this.discoveryService.getProviders();
    providers.forEach((wrapper) => {
      console.log(wrapper.token);
    });
  }
}
