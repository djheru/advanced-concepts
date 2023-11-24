import { Injectable } from '@nestjs/common';

@Injectable()
export class RewardsService {
  constructor() {
    console.log('RewardsService instantiated');
  }
  grantTo() {
    console.log('Hello from the lazy-loaded RewardsService!');
  }
}
